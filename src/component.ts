import { Instance, reconcile } from './reconciler';
import { VComplexNode, VNode } from './vnode';

export abstract class Component<
  P extends Record<string, any>,
  S extends Record<string, any>
  > {
  public props: P;
  public state: S;
  // tslint:disable-next-line:variable-name
  public __internalInstance: Instance;

  constructor(props: P) {
    this.props = props;
  }

  public setState(partialState: Partial<S>) {
    // tslint:disable-next-line:prefer-object-spread
    this.state = Object.assign({}, this.state, partialState);
    updateInstance(this.__internalInstance);
  }

  public abstract render(): VNode;
}

export interface ComponentConstrucor {
  new <P>(props: P): Component<P, any>;
}

function updateInstance(internalInstance: Instance) {
  const parentDOM = internalInstance.dom.parentElement!;
  const element = internalInstance.element;
  reconcile(parentDOM, internalInstance, element);
}

export function createPublicInstance(vNode: VComplexNode): Component<any, any> {
  const { type, props = {} } = vNode;
  const publicInstance = new (type as ComponentConstrucor)(props);
  return publicInstance;
}
