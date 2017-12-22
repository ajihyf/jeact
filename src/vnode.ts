import { ComponentConstrucor } from './component';

export interface VNodeProps {
  [key: string]: any
  className?: string
  children?: VNode[]
}

export const TEXT_ELEMENT: 1 = 1;

export type VNodeType = typeof TEXT_ELEMENT | string | ComponentConstrucor;

export interface VNode {
  type: VNodeType;
  props: VNodeProps;
}

export function isHostType(vNodeType: VNodeType): vNodeType is typeof TEXT_ELEMENT | string {
  return vNodeType === TEXT_ELEMENT || typeof vNodeType === 'string';
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
  return { type: TEXT_ELEMENT, props: { nodeValue: value.toString() } };
}
