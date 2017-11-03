import { render } from '../src/reconciler';
import { h } from '../src/vnode';

let root: HTMLElement;

beforeEach(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
});

afterEach(() => {
  root.innerHTML = '';
  document.body.removeChild(root);
});

it('rerender an element', () => {
  const element = <div>hello world</div>;
  render(element, root);
  expect(root.innerHTML).toBe('<div>hello world</div>');
  render(element, root);
  expect(root.innerHTML).toEqual('<div>hello world</div>');
});
