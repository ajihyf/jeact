import { Component } from './component';
import { VNodeProps, VNodeType } from './vnode';

export enum FiberTag {
  HOST_ROOT,
  HOST_COMPONENT,
  CLASS_COMPONENT
}

export enum EffectTag {
  PLACEMENT,
  DELETION,
  UPDATE
}

export interface Fiber {
  tag: FiberTag;
  props: VNodeProps;
  type?: VNodeType;
  stateNode?: HTMLElement | Component;
  parent?: Fiber;
  child?: Fiber;
  sibling?: Fiber;
  alternate?: Fiber;
  partialState?: Record<string, any>;
  effectTag?: EffectTag;
  effects?: Fiber[];
}
