import { updateClass } from '../src/modules/class';

let root: HTMLElement;

beforeEach(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
});

afterEach(() => {
  document.body.removeChild(root);
});

it('add class to dom', () => {
  const props = {
    class: { hello: true, world: false }
  };
  updateClass(root, {}, props);
  expect(root.className).toBe('hello');
});

it('update class list', () => {
  const prevProps = {
    class: { hello: true, world: true }
  };
  updateClass(root, {}, prevProps);
  const props = { class: { hello: true, world: false, good: true } };
  updateClass(root, prevProps, props);
  expect(root.classList.contains('hello')).toBe(true);
  expect(root.classList.contains('world')).toBe(false);
  expect(root.classList.contains('good')).toBe(true);
});
