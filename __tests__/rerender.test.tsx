import '../__mocks__/_browser-mock';
// tslint:disable-next-line:ordered-imports
import { render } from '../src/reconciler';
import { h } from '../src/vnode';

let root: HTMLElement;

beforeAll(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
});

it('rerender an element', () => {
  const element = <div>hello world</div>;
  render(element, root);
  expect(root.innerHTML).toBe('<div>hello world</div>');
  render(element, root);
  expect(root.innerHTML).toBe('<div>hello world</div>');
});

it('changes a div to span', () => {
  render(<div>hello</div>, root);
  const prevChild = root.firstElementChild;
  render(<span>hello</span>, root);
  const nextChild = root.firstElementChild;
  expect(prevChild).not.toBe(nextChild);
});

it('reuese an element', () => {
  render(<div>good</div>, root);
  const prevChild = root.firstElementChild;
  render(
    <div>
      <span>hello</span>world
    </div>,
    root
  );
  const nextChild = root.firstElementChild;
  expect(prevChild).toBe(nextChild);
});
