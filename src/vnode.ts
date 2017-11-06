import { ComponentConstrucor } from './component';
import { Attrs } from './modules/attrs';
import { Classes } from './modules/class';
import { On } from './modules/eventlistener';

export interface VNodeData {
  class?: Classes;
  attrs?: Attrs;
  on?: On;
}

export type VNodeType = string | ComponentConstrucor;

export interface VComplexNode {
  type: VNodeType;
  data?: VNodeData;
  children?: VNode[];
}

export interface VTextNode {
  text: string;
}

export type VNode = VComplexNode | VTextNode;

export function isVComplexNode(vNode: VNode): vNode is VComplexNode {
  return (vNode as VComplexNode).type !== undefined;
}

export function h(
  type: VNodeType,
  config: any | null,
  ...children: Array<VNode | number | string | boolean | null>
): VNode {
  const data = { ...config };
  const rawChildren: Array<VNode | string | number> = children.filter(
    (c): c is VNode | string | number => c !== null && typeof c !== 'boolean'
  );

  const mappedChildren = rawChildren.map(
    c => (typeof c === 'object' ? c : createTextElement(c))
  );
  return { type, data, children: mappedChildren };
}

function createTextElement(value: string | number): VNode {
  return { text: value.toString() };
}
