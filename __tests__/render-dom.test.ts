import './_browser-mock';
// tslint:disable-next-line:ordered-imports
import { render } from '../src/reconciler';
import { TEXT_ELEMENT, VNode } from '../src/vnode';

let root: HTMLElement;

beforeAll(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
});

it('renders a div', () => {
  const element: VNode = {
    type: 'div',
    props: {}
  };
  render(element, root);
  expect(root.innerHTML).toBe('<div></div>');
});

it('renders a div with props', () => {
  const element: VNode = {
    type: 'div',
    props: {
      className: 'hello',
      align: 'left'
    }
  };
  render(element, root);
  expect(root.innerHTML).toBe('<div align="left" class="hello"></div>');
});

it('renders a div with children', () => {
  const element: VNode = {
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
  const element: VNode = {
    type: 'div',
    props: {
      children: [{ type: TEXT_ELEMENT, props: { nodeValue: 'hello world' } }]
    }
  };
  render(element, root);
  expect(root.innerHTML).toBe('<div>hello world</div>');
});

it('renders a node with event listener', () => {
  const element: VNode = {
    type: 'div',
    props: {
      id: 'root',
      onClick: jest.fn()
    }
  };
  render(element, root);
  document.getElementById('root')!.click();
  expect(element.props.onClick).toHaveBeenCalledTimes(1);
});
