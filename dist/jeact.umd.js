(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash')) :
	typeof define === 'function' && define.amd ? define(['exports', 'lodash'], factory) :
	(factory((global.jeact = {}),global.lodash));
}(this, (function (exports,lodash) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */





function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function updateAttrs(dom, prevProps, nextProps) {
    if (dom.nodeType === document.TEXT_NODE) {
        dom.nodeValue = nextProps.nodeValue;
        return;
    }
    if (!prevProps && !nextProps)
        return;
    if (prevProps === nextProps)
        return;
    const { className: oldKlass, children } = prevProps, oldAttrs = __rest(prevProps, ["className", "children"]);
    const { className: klass, children: newChildren } = nextProps, attrs = __rest(nextProps, ["className", "children"]);
    const oldOn = {};
    const on = {};
    for (const key in oldAttrs) {
        if (key.startsWith('on')) {
            oldOn[key.substring(2).toLowerCase()] = oldAttrs[key];
            delete oldAttrs[key];
        }
    }
    for (const key in attrs) {
        if (key.startsWith('on')) {
            on[key.substring(2).toLowerCase()] = attrs[key];
            delete attrs[key];
        }
    }
    for (const key in attrs) {
        const cur = attrs[key];
        const old = oldAttrs[key];
        if (cur !== old) {
            if (cur === true) {
                dom.setAttribute(key, '');
            }
            else if (cur === false) {
                dom.removeAttribute(key);
            }
            else {
                dom.setAttribute(key, cur);
            }
        }
    }
    for (const key in oldAttrs) {
        if (!(key in attrs)) {
            dom.removeAttribute(key);
        }
    }
    if (!klass) {
        dom.removeAttribute('class');
    }
    else if (oldKlass !== klass) {
        dom.className = klass;
    }
    for (const name in oldOn) {
        if (!on || on[name] !== oldOn[name]) {
            dom.removeEventListener(name, oldOn[name], false);
        }
    }
    for (const name in on) {
        if (!oldOn || on[name] !== oldOn[name]) {
            dom.addEventListener(name, on[name], false);
        }
    }
}

const TEXT_ELEMENT = 1;
function isHostType(vNodeType) {
    return vNodeType === TEXT_ELEMENT || typeof vNodeType === 'string';
}
function h(type, passedProps, ...children) {
    const props = Object.assign({}, passedProps);
    const rawChildren = children.filter((c) => c !== null && typeof c !== 'boolean');
    props.children = rawChildren.map(c => (typeof c === 'object' ? c : createTextElement(c)));
    return { type, props };
}
function createTextElement(value) {
    return { type: TEXT_ELEMENT, props: { nodeValue: value.toString() } };
}

var FiberTag;
(function (FiberTag) {
    FiberTag[FiberTag["HOST_ROOT"] = 0] = "HOST_ROOT";
    FiberTag[FiberTag["HOST_COMPONENT"] = 1] = "HOST_COMPONENT";
    FiberTag[FiberTag["CLASS_COMPONENT"] = 2] = "CLASS_COMPONENT";
})(FiberTag || (FiberTag = {}));
var EffectTag;
(function (EffectTag) {
    EffectTag[EffectTag["PLACEMENT"] = 0] = "PLACEMENT";
    EffectTag[EffectTag["DELETION"] = 1] = "DELETION";
    EffectTag[EffectTag["UPDATE"] = 2] = "UPDATE";
})(EffectTag || (EffectTag = {}));
const rIC = window.requestIdleCallback;
const ENOUGH_TIME = 1;
const updateQueue = [];
let nextUnitOfWork = null;
let pendingCommit = null;
function performWork(deadline) {
    workLoop(deadline);
    if (nextUnitOfWork || updateQueue.length > 1) {
        rIC(performWork);
    }
}
function workLoop(deadline) {
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
    const root = update.from === FiberTag.HOST_ROOT
        ? update.dom._rootContainerFiber
        : getRoot(update.instance.__fiber);
    nextUnitOfWork = {
        tag: FiberTag.HOST_ROOT,
        stateNode: update.from === FiberTag.HOST_ROOT ? update.dom : root.stateNode,
        props: update.from === FiberTag.HOST_ROOT ? update.newProps : root.props,
        alternate: root
    };
}
function getRoot(fiber) {
    let node = fiber;
    while (node.parent) {
        node = node.parent;
    }
    return node;
}
function performUnitOfWork(wipFiber) {
    beginWork(wipFiber);
    if (wipFiber.child) {
        return wipFiber.child;
    }
    let uow = wipFiber;
    while (uow) {
        completeWork(uow);
        if (uow.sibling) {
            return uow.sibling;
        }
        uow = uow.parent;
    }
    return null;
}
function beginWork(wipFiber) {
    if (wipFiber.tag === FiberTag.CLASS_COMPONENT) {
        updateClassComponent(wipFiber);
    }
    else {
        updateHostComponent(wipFiber);
    }
}
function updateHostComponent(wipFiber) {
    if (!wipFiber.stateNode) {
        wipFiber.stateNode = createDomElement(wipFiber);
    }
    const newChildElements = wipFiber.props.children || [];
    reconcileChildrenArray(wipFiber, newChildElements);
}
function updateClassComponent(wipFiber) {
    let instance = wipFiber.stateNode;
    if (!instance) {
        instance = wipFiber.stateNode = createInstance(wipFiber);
    }
    else if (wipFiber.props === instance.props && !wipFiber.partialState) {
        cloneChildFibers(wipFiber);
        return;
    }
    instance.props = wipFiber.props;
    instance.state = Object.assign({}, instance.state, wipFiber.partialState);
    wipFiber.partialState = undefined;
    const newChildElements = instance.render();
    reconcileChildrenArray(wipFiber, newChildElements);
}
function arrify(val) {
    if (Array.isArray(val)) {
        return val;
    }
    return [val];
}
function cloneChildFibers(parentFiber) {
    const oldFiber = parentFiber.alternate;
    if (!oldFiber || !oldFiber.child) {
        return;
    }
    let oldChild = oldFiber.child;
    let prevChild;
    while (oldChild) {
        const newChild = {
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
        }
        else {
            parentFiber.child = newChild;
        }
        prevChild = newChild;
        oldChild = oldChild.sibling;
    }
}
function reconcileChildrenArray(wipFiber, newChildElements) {
    const elements = arrify(newChildElements);
    let index = 0;
    let oldFiber = wipFiber.alternate ? wipFiber.alternate.child : undefined;
    let newFiber;
    while (index < elements.length || oldFiber) {
        const prevFiber = newFiber;
        const element = index < elements.length ? elements[index] : null;
        const sameType = oldFiber && element && element.type === oldFiber.type;
        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                tag: oldFiber.tag,
                stateNode: oldFiber.stateNode,
                props: element.props,
                parent: wipFiber,
                alternate: oldFiber,
                partialState: oldFiber.partialState,
                effectTag: EffectTag.UPDATE
            };
        }
        if (element && !sameType) {
            newFiber = {
                type: element.type,
                tag: isHostType(element.type) ? FiberTag.HOST_COMPONENT : FiberTag.CLASS_COMPONENT,
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
        }
        else if (prevFiber && element) {
            prevFiber.sibling = newFiber;
        }
        index++;
    }
}
function completeWork(fiber) {
    if (fiber.tag === FiberTag.CLASS_COMPONENT) {
        fiber.stateNode.__fiber = fiber;
    }
    if (fiber.parent) {
        const childEffects = fiber.effects || [];
        const thisEffects = !lodash.isNil(fiber.effectTag) ? [fiber] : [];
        const parentEffects = fiber.parent.effects || [];
        fiber.parent.effects = [...parentEffects, ...thisEffects, ...childEffects];
    }
    else {
        pendingCommit = fiber;
    }
}
function commitAllWork(fiber) {
    if (fiber.effects) {
        fiber.effects.forEach(f => {
            commitWork(f);
        });
    }
    fiber.stateNode._rootContainerFiber = fiber;
    nextUnitOfWork = null;
    pendingCommit = null;
}
function commitWork(fiber) {
    if (fiber.tag === FiberTag.HOST_ROOT) {
        return;
    }
    let domParentFiber = fiber.parent;
    while (domParentFiber.tag === FiberTag.CLASS_COMPONENT) {
        domParentFiber = domParentFiber.parent;
    }
    const domParent = domParentFiber.stateNode;
    if (fiber.effectTag === EffectTag.PLACEMENT && fiber.tag === FiberTag.HOST_COMPONENT) {
        domParent.appendChild(fiber.stateNode);
    }
    else if (fiber.effectTag === EffectTag.UPDATE) {
        updateDOM(fiber.stateNode, fiber.alternate.props, fiber.props);
    }
    else if (fiber.effectTag === EffectTag.DELETION) {
        commitDeletion(fiber, domParent);
    }
}
function commitDeletion(fiber, domParent) {
    let node = fiber;
    while (true) {
        if (node.tag === FiberTag.CLASS_COMPONENT) {
            node = node.child;
            continue;
        }
        domParent.removeChild(node.stateNode);
        while (node !== fiber && !node.sibling) {
            node = node.parent;
        }
        if (node === fiber) {
            return;
        }
        node = node.sibling;
    }
}
function render(elements, containerDom) {
    updateQueue.push({
        from: FiberTag.HOST_ROOT,
        dom: containerDom,
        newProps: {
            children: arrify(elements)
        }
    });
    rIC(performWork);
}
function scheduleUpdate(instance, partialState) {
    updateQueue.push({
        from: FiberTag.CLASS_COMPONENT,
        instance,
        partialState
    });
    rIC(performWork);
}
function updateDOM(dom, prevData, data) {
    updateAttrs(dom, prevData, data);
}
function createDomElement(fiber) {
    if (!fiber.type || !isHostType(fiber.type)) {
        throw new Error('Fiber must have a host type');
    }
    const dom = fiber.type === TEXT_ELEMENT
        ? document.createTextNode('')
        : document.createElement(fiber.type);
    updateDOM(dom, {}, fiber.props);
    return dom;
}

class Component {
    constructor(props) {
        this.props = props;
    }
    setState(partialState) {
        scheduleUpdate(this, partialState);
    }
}
function createInstance(fiber) {
    const { type, props = {} } = fiber;
    const publicInstance = new type(props);
    publicInstance.__fiber = fiber;
    return publicInstance;
}

var jeact = {
    h,
    Component,
    render
};

exports['default'] = jeact;
exports.Component = Component;
exports.render = render;
exports.h = h;

Object.defineProperty(exports, '__esModule', { value: true });

})));
