import { h, isVComplexNode } from '../src/vnode';

test('isVComplextNode', () => {
  expect(isVComplexNode({ type: 'div', data: {}, children: [] })).toBe(true);
  expect(isVComplexNode({ text: 'good' })).toBe(false);
});

test('createElement', () => {
  const element = h(
    'div',
    { class: { good: true } },
    h('span', null),
    h('div', null, 'world')
  );
  expect(element).toEqual({
    type: 'div',
    data: {
      class: { good: true }
    },
    children: [
      { type: 'span', children: [], data: {} },
      {
        type: 'div',
        data: {},
        children: [
          {
            text: 'world'
          }
        ]
      }
    ]
  });
});
