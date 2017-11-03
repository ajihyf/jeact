import { updateListener } from '../src/modules/eventlistener';

let root: HTMLElement;

beforeEach(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
});

afterEach(() => {
  document.body.removeChild(root);
});

it('add event listner', () => {
  const props = {
    on: { click: jest.fn() }
  };
  updateListener(root, {}, props);
  root.click();
  expect(props.on.click).toHaveBeenCalledTimes(1);
});

it('removes listener', () => {
  const prevProps = {
    on: { click: jest.fn() }
  };
  updateListener(root, {}, prevProps);
  root.click();
  const props = {};
  updateListener(root, prevProps, props);
  root.click();
  expect(prevProps.on.click).toHaveBeenCalledTimes(1);
});
