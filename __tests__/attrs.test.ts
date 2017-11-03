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
    attrs: {
      align: 'left'
    }
  };
  updateAttrs(root, {}, prevProps);
  expect(root.getAttribute('align')).toBe('left');
});

it('should remove old attrs', () => {
  const prevProps = { attrs: { align: 'left' } };
  updateAttrs(root, {}, prevProps);
  const nextProps = {};
  updateAttrs(root, prevProps, nextProps);
  expect(root.hasAttribute('align')).toBe(false);
});

it('should reuse old attrs', () => {
  const prevProps = { attrs: { align: 'left', float: 'none' } };
  updateAttrs(root, {}, prevProps);
  const nextProps = { attrs: { align: 'left', float: 'left' } };
  updateAttrs(root, prevProps, nextProps);
  expect(root.getAttribute('align')).toBe('left');
  expect(root.getAttribute('float')).toBe('left');
});
