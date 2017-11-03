import { VNodeData } from '../vnode';

export type Classes = Record<string, boolean>;

export function updateClass(
  dom: Element,
  prevProps: VNodeData,
  props: VNodeData
) {
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
      } else {
        dom.classList.remove(name);
      }
    }
  }
}
