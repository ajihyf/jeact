import { VNodeData } from '../vnode';

export type Attrs = Record<string, any>;

export function updateAttrs(
  dom: Element,
  prevProps: VNodeData,
  nextProps: VNodeData
) {
  let oldAttrs = prevProps.attrs;
  let attrs = nextProps.attrs;
  if (!oldAttrs && !attrs) return;
  if (oldAttrs === attrs) return;
  oldAttrs = oldAttrs || {};
  attrs = attrs || {};

  for (const key in attrs) {
    const cur = attrs[key];
    const old = oldAttrs[key];

    if (cur !== old) {
      if (cur === true) {
        dom.setAttribute(key, '');
      } else if (cur === false) {
        dom.removeAttribute(key);
      } else {
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
