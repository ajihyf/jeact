import { render } from '../src/reconciler';
import { h } from '../src/vnode';

let root: HTMLElement;

beforeAll(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
});

it('renders a jsx div', () => {
  const element = <div />;
  render(element, root);
  expect(root.innerHTML).toBe('<div></div>');
});

it('renders a jsx with attrs', () => {
  const element = <div attrs={{ align: 'left' }} />;
  render(element, root);
  expect(root.innerHTML).toBe('<div align="left"></div>');
});

it('renders a div with children', () => {
  const element = (
    <div>
      <span />
      <div attrs={{ id: 'hello' }} />
    </div>
  );
  render(element, root);
  expect(root.innerHTML).toBe('<div><span></span><div id="hello"></div></div>');
});

it('renders a text node', () => {
  const element = <div>hello world</div>;
  render(element, root);
  expect(root.innerHTML).toBe('<div>hello world</div>');
});
