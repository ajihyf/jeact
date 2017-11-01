export interface Element {
  type: string,
  props: {
    children?: Element[],
    [key: string]: any
  }
}

const isListener = (attr: string) => attr.startsWith('on');
const isAttribute = (attr: string) => attr !== 'children' && !isListener(attr);

export const TEXT_ELEMENT = 'TEXT_ELEMENT';
const isTextElement = (type: string) => type === TEXT_ELEMENT;

export function render(element: Element, parentDOM: HTMLElement) {
  const { type, props } = element;
  let node: HTMLElement | Text;
  if (isTextElement(type)) {
    node = document.createTextNode('');
  } else {
    const dom = document.createElement(type);
    Object.keys(props).filter(isListener).forEach(prop => {
      const eventType = prop.toLowerCase().substring(2);
      dom.addEventListener(eventType, props[prop]);
    });
    const childElements = props.children || [];
    childElements.forEach(ele => render(ele, dom));
    node = dom;
  }
  Object.keys(props).filter(isAttribute).forEach(attr => {
    node[attr] = props[attr];
  });
  parentDOM.appendChild(node);
}
