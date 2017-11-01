import { createElement } from '../src/element';
import { render } from '../src/reconciler';

let root: HTMLElement;

beforeEach(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
});

afterEach(() => {
  root.innerHTML = '';
  document.body.removeChild(root);
});

it('renders a jsx div', () => {
  const element = <div />;
  render(element, root);
  expect(root.innerHTML).toBe('<div></div>');
});

it('renders a jsx with attrs', () => {
  const element = <div className="hello" />;
  render(element, root);
  expect(root.innerHTML).toBe('<div class="hello"></div>');
});

it('renders a div with children', () => {
  const element = <div><span /><div id="hello" /></div>;
  render(element, root);
  expect(root.innerHTML).toBe('<div><span></span><div id="hello"></div></div>');
});

it('renders a text node', () => {
  const element = <div>hello world</div>;
  render(element, root);
  expect(root.innerHTML).toBe('<div>hello world</div>');
});


it('renders a text node with num', () => {
  const element = <div>233</div>;
  render(element, root);
  expect(root.innerHTML).toBe('<div>233</div>');
});
