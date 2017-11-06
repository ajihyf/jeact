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

it('renders a class', () => {
  const element = <div class={{ hello: true, world: false }}>hello world</div>;
  render(element, root);
  expect(root.innerHTML).toBe('<div class="hello">hello world</div>');
});

it('renders a event listener', () => {
  const spy = jest.fn();
  const element = (
    <div attrs={{ id: 'hello' }} on={{ click: spy }}>
      hello world
    </div>
  );
  render(element, root);
  document.getElementById('hello')!.click();
  expect(spy).toHaveBeenCalledTimes(1);
});
