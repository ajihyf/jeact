import isNil from 'lodash/isNil';
import { Component, ComponentConstrucor } from './component';
import { EffectTag, Fiber, FiberTag } from './fiber';
import { updateAttrs } from './modules/attrs';
import { Deadline, rIC } from './ric';
import { arrify } from './utils';
import { isHostType, TEXT_ELEMENT, VNode, VNodeProps } from './vnode';

export function createInstance(fiber: Fiber): Component {
  const { type, props = {} } = fiber;
  const publicInstance = new (type as ComponentConstrucor)(props);
  publicInstance.__fiber = fiber;
  return publicInstance;
}

type UpdateTask =
  | {
      from: FiberTag.HOST_ROOT;
      dom: HTMLElement;
      newProps: VNodeProps;
    }
  | {
      from: FiberTag.CLASS_COMPONENT;
      instance: Component;
      partialState: Record<string, any>;
    };

const ENOUGH_TIME = 1;

const updateQueue: UpdateTask[] = [];

let nextUnitOfWork: Fiber | null = null;
let pendingCommit: Fiber | null = null;

function performWork(deadline: Deadline) {
  workLoop(deadline);

  if (nextUnitOfWork || updateQueue.length > 1) {
    rIC(performWork);
  }
}

function workLoop(deadline: Deadline) {
  if (!nextUnitOfWork) {
    resetNextUnitOfWork();
  }

  while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
}

function resetNextUnitOfWork() {
  const update = updateQueue.shift();

  if (!update) {
    return;
  }

  if (update.from === FiberTag.CLASS_COMPONENT && update.partialState) {
    update.instance.__fiber.partialState = update.partialState;
  }

  const root: Fiber =
    update.from === FiberTag.HOST_ROOT
      ? (update.dom as any)._rootContainerFiber
      : getRoot(update.instance.__fiber);

  nextUnitOfWork = {
    tag: FiberTag.HOST_ROOT,
    stateNode: update.from === FiberTag.HOST_ROOT ? update.dom : root.stateNode,
    props: update.from === FiberTag.HOST_ROOT ? update.newProps : root.props,
    alternate: root
  };
}

function getRoot(fiber: Fiber): Fiber {
  let node = fiber;
  while (node.parent) {
    node = node.parent;
  }
  return node;
}

function performUnitOfWork(wipFiber: Fiber): Fiber | null {
  beginWork(wipFiber);
  if (wipFiber.child) {
    return wipFiber.child;
  }

  let uow: Fiber | undefined = wipFiber;
  while (uow) {
    completeWork(uow);
    if (uow.sibling) {
      return uow.sibling;
    }
    uow = uow.parent;
  }

  return null;
}

function beginWork(wipFiber: Fiber) {
  if (wipFiber.tag === FiberTag.CLASS_COMPONENT) {
    updateClassComponent(wipFiber);
  } else {
    updateHostComponent(wipFiber);
  }
}

function updateHostComponent(wipFiber: Fiber) {
  if (!wipFiber.stateNode) {
    wipFiber.stateNode = createDomElement(wipFiber);
  }

  const newChildElements = wipFiber.props.children || [];
  reconcileChildrenArray(wipFiber, newChildElements);
}

function updateClassComponent(wipFiber: Fiber) {
  let instance = wipFiber.stateNode as Component;
  if (!instance) {
    instance = wipFiber.stateNode = createInstance(wipFiber);
  } else if (wipFiber.props === instance.props && !wipFiber.partialState) {
    cloneChildFibers(wipFiber);
    return;
  }

  instance.props = wipFiber.props;
  instance.state = { ...instance.state, ...wipFiber.partialState };
  wipFiber.partialState = undefined;

  const newChildElements = instance.render();
  reconcileChildrenArray(wipFiber, newChildElements);
}

function cloneChildFibers(parentFiber: Fiber) {
  const oldFiber = parentFiber.alternate;

  if (!oldFiber || !oldFiber.child) {
    return;
  }

  let oldChild: Fiber | undefined = oldFiber.child;
  let prevChild: Fiber | undefined;

  while (oldChild) {
    const newChild: Fiber = {
      tag: oldChild.tag,
      type: oldChild.type,
      stateNode: oldChild.stateNode,
      props: oldChild.props,
      partialState: oldChild.partialState,
      alternate: oldChild,
      parent: parentFiber
    };

    if (prevChild) {
      prevChild.sibling = newChild;
    } else {
      parentFiber.child = newChild;
    }

    prevChild = newChild;
    oldChild = oldChild.sibling;
  }
}

function reconcileChildrenArray(
  wipFiber: Fiber,
  newChildElements: VNode | VNode[]
) {
  const elements = arrify(newChildElements);

  let index = 0;
  let oldFiber = wipFiber.alternate ? wipFiber.alternate.child : undefined;
  let newFiber: Fiber | undefined;

  while (index < elements.length || oldFiber) {
    const prevFiber = newFiber;
    const element = index < elements.length ? elements[index] : null;
    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber!.type,
        tag: oldFiber!.tag,
        stateNode: oldFiber!.stateNode,
        props: element!.props,
        parent: wipFiber,
        alternate: oldFiber,
        partialState: oldFiber!.partialState,
        effectTag: EffectTag.UPDATE
      };
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        tag: isHostType(element.type)
          ? FiberTag.HOST_COMPONENT
          : FiberTag.CLASS_COMPONENT,
        props: element.props,
        parent: wipFiber,
        effectTag: EffectTag.PLACEMENT
      };
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = EffectTag.DELETION;
      wipFiber.effects = wipFiber.effects || [];
      wipFiber.effects.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (prevFiber && element) {
      prevFiber.sibling = newFiber;
    }

    index++;
  }
}

function completeWork(fiber: Fiber) {
  if (fiber.tag === FiberTag.CLASS_COMPONENT) {
    (fiber.stateNode as Component).__fiber = fiber;
  }

  if (fiber.parent) {
    const childEffects = fiber.effects || [];
    const thisEffects = !isNil(fiber.effectTag) ? [fiber] : [];
    const parentEffects = fiber.parent.effects || [];
    fiber.parent.effects = [...parentEffects, ...thisEffects, ...childEffects];
  } else {
    pendingCommit = fiber;
  }
}

function commitAllWork(fiber: Fiber) {
  if (fiber.effects) {
    fiber.effects.forEach(f => {
      commitWork(f);
    });
  }
  (fiber.stateNode as any)._rootContainerFiber = fiber;
  nextUnitOfWork = null;
  pendingCommit = null;
}

function commitWork(fiber: Fiber) {
  if (fiber.tag === FiberTag.HOST_ROOT) {
    return;
  }

  let domParentFiber = fiber.parent!;

  while (domParentFiber.tag === FiberTag.CLASS_COMPONENT) {
    domParentFiber = domParentFiber.parent!;
  }

  const domParent = domParentFiber.stateNode as HTMLElement;

  if (
    fiber.effectTag === EffectTag.PLACEMENT &&
    fiber.tag === FiberTag.HOST_COMPONENT
  ) {
    domParent.appendChild(fiber.stateNode as HTMLElement);
  } else if (fiber.effectTag === EffectTag.UPDATE) {
    updateDOM(
      fiber.stateNode as HTMLElement,
      fiber.alternate!.props,
      fiber.props
    );
  } else if (fiber.effectTag === EffectTag.DELETION) {
    commitDeletion(fiber, domParent);
  }
}

function commitDeletion(fiber: Fiber, domParent: HTMLElement) {
  let node = fiber;
  while (true) {
    if (node.tag === FiberTag.CLASS_COMPONENT) {
      node = node.child!;
      continue;
    }
    domParent.removeChild(node.stateNode as HTMLElement);
    while (node !== fiber && !node.sibling) {
      node = node.parent!;
    }
    if (node === fiber) {
      return;
    }
    node = node.sibling!;
  }
}

export function render(elements: VNode | VNode[], containerDom: HTMLElement) {
  updateQueue.push({
    from: FiberTag.HOST_ROOT,
    dom: containerDom,
    newProps: {
      children: arrify(elements)
    }
  });
  rIC(performWork);
}

export function scheduleUpdate(
  instance: Component,
  partialState: Record<string, any>
) {
  updateQueue.push({
    from: FiberTag.CLASS_COMPONENT,
    instance,
    partialState
  });
  rIC(performWork);
}

function updateDOM(dom: HTMLElement, prevData: VNodeProps, data: VNodeProps) {
  updateAttrs(dom, prevData, data);
}

function createDomElement(fiber: Fiber): HTMLElement {
  if (!fiber.type || !isHostType(fiber.type)) {
    throw new Error('Fiber must have a host type');
  }
  const dom =
    fiber.type === TEXT_ELEMENT
      ? document.createTextNode('')
      : document.createElement(fiber.type);
  updateDOM(dom as HTMLElement, {}, fiber.props);
  return dom as HTMLElement;
}
