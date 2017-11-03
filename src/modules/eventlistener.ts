import { VNodeData } from '../vnode';

export type On = {
  [N in keyof HTMLElementEventMap]?: (ev: HTMLElementEventMap[N]) => void
} & { [event: string]: EventListener };

export function updateListener(
  dom: HTMLElement,
  prevProps: VNodeData,
  props: VNodeData
) {
  const oldOn = prevProps.on;
  const on = props.on;

  if (oldOn === on) return;

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
