import { render } from '../src/reconciler';
import { VNode } from '../src/vnode';

let root: HTMLElement;

beforeAll(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
});

it('renders a div', () => {
  const element: VNode = {
    type: 'div'
  };
  render(element, root);
  expect(root.innerHTML).toBe('<div></div>');
});

it('renders a div with props', () => {
  const element: VNode = {
    type: 'div',
    data: {
      class: { hello: true, world: false },
      attrs: {
        align: 'left'
      }
    }
  };
  render(element, root);
  expect(root.innerHTML).toBe('<div class="hello" align="left"></div>');
});

it('renders a div with children', () => {
  const element: VNode = {
    type: 'div',
    children: [
      { type: 'span' },
      { type: 'div', data: { attrs: { id: 'hello' } } }
    ]
  };
  render(element, root);
  expect(root.innerHTML).toBe('<div><span></span><div id="hello"></div></div>');
});

it('renders a text node', () => {
  const element: VNode = {
    type: 'div',
    children: [{ text: 'hello world' }]
  };
  render(element, root);
  expect(root.innerHTML).toBe('<div>hello world</div>');
});

it('renders a node with event listener', () => {
  const element: VNode = {
    type: 'div',
    data: {
      attrs: {
        id: 'root'
      },
      on: {
        click: jest.fn()
      }
    }
  };
  render(element, root);
  document.getElementById('root').click();
  expect(element.data.on.click).toHaveBeenCalledTimes(1);
});
