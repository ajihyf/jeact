import { ComponentConstrucor } from './component';

export interface VNodeProps {
  [key: string]: any
  className?: string
  children?: VNode[]
}

export type VNodeType = string | ComponentConstrucor;

export interface VComplexNode {
  type: VNodeType;
  props: VNodeProps;
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
  passedProps: any | null,
  ...children: Array<VNode | number | string | boolean | null>
): VNode {
  const props: VNodeProps = { ...passedProps };
  const rawChildren: Array<VNode | string | number> = children.filter(
    (c): c is VNode | string | number => c !== null && typeof c !== 'boolean'
  );

  props.children = rawChildren.map(
    c => (typeof c === 'object' ? c : createTextElement(c))
  );

  return { type, props };
}

function createTextElement(value: string | number): VNode {
  return { text: value.toString() };
}
