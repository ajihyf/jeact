import { h, isVComplexNode } from '../src/vnode';

test('isVComplextNode', () => {
  expect(isVComplexNode({ type: 'div', props: { children: [] } })).toBe(true);
  expect(isVComplexNode({ text: 'good' })).toBe(false);
});

test('createElement', () => {
  const element = h(
    'div',
    { className: 'good' },
    h('span', null),
    h('div', null, 'world')
  );
  expect(element).toEqual({
    type: 'div',
    props: {
      className: 'good',
      children: [
        { type: 'span', props: { children: [] } },
        {
          type: 'div',
          props: {
            children: [
              {
                text: 'world'
              }
            ]
          }
        }
      ]
    }
  });
});
