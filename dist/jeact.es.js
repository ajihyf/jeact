import { isNil } from 'lodash';

function updateAttrs(dom, prevProps, nextProps) {
    let oldAttrs = prevProps.attrs;
    let attrs = nextProps.attrs;
    if (!oldAttrs && !attrs)
        return;
    if (oldAttrs === attrs)
        return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};
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
}

function updateClass(dom, prevProps, props) {
    let oldKlass = prevProps.class;
    let klass = props.class;
    if ((!oldKlass && !klass) || oldKlass === klass) {
        return;
    }
    if (!klass) {
        dom.removeAttribute('class');
        return;
    }
    oldKlass = oldKlass = oldKlass || {};
    klass = klass || {};
    for (const name in oldKlass) {
        if (!klass[name]) {
            dom.classList.remove(name);
        }
    }
    for (const name in klass) {
        const hasKlass = klass[name];
        if (hasKlass !== oldKlass[name]) {
            if (hasKlass) {
                dom.classList.add(name);
            }
            else {
                dom.classList.remove(name);
            }
        }
    }
}

function updateListener(dom, prevProps, props) {
    const oldOn = prevProps.on;
    const on = props.on;
    if (oldOn === on)
        return;
    if (oldOn) {
        for (const name in oldOn) {
            if (!on || on[name] !== oldOn[name]) {
                dom.removeEventListener(name, oldOn[name], false);
            }
        }
    }
    if (on) {
        for (const name in on) {
            if (!oldOn || on[name] !== oldOn[name]) {
                dom.addEventListener(name, on[name], false);
            }
        }
    }
}

function isVComplexNode(vNode) {
    return vNode.type !== undefined;
}
function h(type, config, ...children) {
    const data = Object.assign({}, config);
    const rawChildren = children.filter((c) => c !== null && typeof c !== 'boolean');
    const mappedChildren = rawChildren.map(c => (typeof c === 'object' ? c : createTextElement(c)));
    return { type, data, children: mappedChildren };
}
function createTextElement(value) {
    return { text: value.toString() };
}

let rootInstance;
function render(element, parentDOM) {
    const prevInstance = rootInstance;
    const nextInstance = reconcile(parentDOM, prevInstance, element);
    rootInstance = nextInstance;
}
function reconcile(parentDOM, instance, element) {
    if (isNil(instance)) {
        if (!isNil(element)) {
            const newInstance = instantiate(element);
            parentDOM.appendChild(newInstance.dom);
            return newInstance;
        }
        return null;
    }
    else if (isNil(element)) {
        parentDOM.removeChild(instance.dom);
        return null;
    }
    else if (isVComplexNode(instance.element) &&
        isVComplexNode(element) &&
        instance.element.type === element.type) {
        if (typeof element.type === 'string') {
            updateDOM(instance.dom, instance.element.data, element.data);
            instance.element = element;
            instance.childInstances = reconcileChildren(instance, element);
            return instance;
        }
        else {
            instance.publicInstance.props = element.data;
            const childElement = instance.publicInstance.render();
            const oldInstance = instance.childInstance;
            const newInstance = reconcile(parentDOM, oldInstance, childElement);
            instance.dom = newInstance.dom;
            instance.childInstance = newInstance;
            instance.element = element;
            return instance;
        }
    }
    else {
        const newInstance = instantiate(element);
        parentDOM.replaceChild(newInstance.dom, instance.dom);
        return newInstance;
    }
}
function reconcileChildren(instance, element) {
    const dom = instance.dom;
    const childInstances = instance.childInstances || [];
    const nextChildren = element.children || [];
    const newChildInstances = [];
    const count = Math.max(childInstances.length, nextChildren.length);
    for (let i = 0; i < count; i++) {
        const childInstance = childInstances[i];
        const childElement = nextChildren[i];
        const newChildInstance = reconcile(dom, childInstance, childElement);
        if (newChildInstance !== null) {
            newChildInstances.push(newChildInstance);
        }
    }
    return newChildInstances;
}
function updateDOM(dom, prevData = {}, data = {}) {
    updateListener(dom, prevData, data);
    updateClass(dom, prevData, data);
    updateAttrs(dom, prevData, data);
}
function instantiate(vNode) {
    if (isVComplexNode(vNode)) {
        const { type, data, children = [] } = vNode;
        if (typeof type === 'string') {
            const dom = document.createElement(type);
            updateDOM(dom, {}, data);
            const childInstances = children.map(instantiate);
            childInstances.forEach(c => dom.appendChild(c.dom));
            return { dom, element: vNode, childInstances };
        }
        else {
            const publicInstance = createPublicInstance(vNode);
            const childElement = publicInstance.render();
            const childInstance = instantiate(childElement);
            const dom = childInstance.dom;
            const instance = {
                dom,
                childInstance,
                element: vNode,
                publicInstance
            };
            publicInstance.__internalInstance = instance;
            return instance;
        }
    }
    else {
        const node = document.createTextNode(vNode.text);
        return { dom: node, element: vNode };
    }
}

class Component {
    constructor(props) {
        this.props = props;
    }
    setState(partialState) {
        // tslint:disable-next-line:prefer-object-spread
        this.state = Object.assign({}, this.state, partialState);
        updateInstance(this.__internalInstance);
    }
}
function updateInstance(internalInstance) {
    const parentDOM = internalInstance.dom.parentElement;
    const element = internalInstance.element;
    reconcile(parentDOM, internalInstance, element);
}
function createPublicInstance(vNode) {
    const { type, data = {} } = vNode;
    const publicInstance = new type(data);
    return publicInstance;
}

var jeact = {
    h,
    Component,
    render
};

export { Component, render, h };
export default jeact;
