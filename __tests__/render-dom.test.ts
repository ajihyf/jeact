import { Element, render, TEXT_ELEMENT } from '../src/reconciler';

let root: HTMLElement;

beforeEach(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
});

afterEach(() => {
  root.innerHTML = '';
  document.body.removeChild(root);
});

it('renders a div', () => {
  const element = {
    type: 'div',
    props: {}
  };
  render(element, root);
  expect(root.innerHTML).toBe('<div></div>');
});

it('renders a div with props', () => {
  const element = {
    type: 'div',
    props: {
      className: 'happy'
    }
  };
  render(element, root);
  expect(root.innerHTML).toBe('<div class="happy"></div>');
});

it('renders a div with children', () => {
  const element = {
    type: 'div',
    props: {
      children: [
        { type: 'span', props: {} },
        { type: 'div', props: { id: 'hello' } }
      ]
    }
  };
  render(element, root);
  expect(root.innerHTML).toBe('<div><span></span><div id="hello"></div></div>');
});

it('renders a text node', () => {
  const element = {
    type: 'div',
    props: {
      children: [
        { type: TEXT_ELEMENT, props: { nodeValue: 'hello world' } }
      ]
    }
  };
  render(element, root);
  expect(root.innerHTML).toBe('<div>hello world</div>');
});
