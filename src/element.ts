interface ElementProps {
  children?: Element[],
  [key: string]: any
}

export interface Element {
  type: string,
  props: ElementProps
}


export const TEXT_ELEMENT = 'TEXT_ELEMENT';

export function createElement(type: string, config: ElementProps, ...children: Array<Element | number | string | boolean | null>): Element {
  const props = Object.assign({}, config);
  const rawChildren: Array<Element | string | number> = children
    .filter((c): c is Element | string | number => c !== null && typeof c !== 'boolean');

  props.children = rawChildren
    .map(c => typeof c === 'object' ? c : createTextElement(c));
  return { type, props };
}

function createTextElement(value: string | number): Element {
  return { type: TEXT_ELEMENT, props: { nodeValue: value } };
}
