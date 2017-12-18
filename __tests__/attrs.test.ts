import { updateAttrs } from '../src/modules/attrs';

let root: HTMLElement;

beforeEach(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
});

afterEach(() => {
  document.body.removeChild(root);
});

it('should add attrs for init', () => {
  const prevProps = {
    align: 'left'
  };
  updateAttrs(root, {}, prevProps);
  expect(root.getAttribute('align')).toBe('left');
});

it('should remove old attrs', () => {
  const prevProps = { align: 'left' };
  updateAttrs(root, {}, prevProps);
  const nextProps = {};
  updateAttrs(root, prevProps, nextProps);
  expect(root.hasAttribute('align')).toBe(false);
});

it('should reuse old attrs', () => {
  const prevProps = { align: 'left', float: 'none' };
  updateAttrs(root, {}, prevProps);
  const nextProps = { align: 'left', float: 'left' };
  updateAttrs(root, prevProps, nextProps);
  expect(root.getAttribute('align')).toBe('left');
  expect(root.getAttribute('float')).toBe('left');
});

it('add class to dom', () => {
  const props = {
    className: 'hello'
  };
  updateAttrs(root, {}, props);
  expect(root.className).toBe('hello');
});

it('add event listner', () => {
  const props = {
    onClick: jest.fn()
  };
  updateAttrs(root, {}, props);
  root.click();
  expect(props.onClick).toHaveBeenCalledTimes(1);
});

it('removes listener', () => {
  const prevProps = {
    onClick: jest.fn()
  };
  updateAttrs(root, {}, prevProps);
  root.click();
  const props = {};
  updateAttrs(root, prevProps, props);
  root.click();
  expect(prevProps.onClick).toHaveBeenCalledTimes(1);
});
