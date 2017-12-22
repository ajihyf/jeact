import { h, TEXT_ELEMENT } from '../src/vnode';

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
                type: TEXT_ELEMENT,
                props: {
                  nodeValue: 'world'
                }
              }
            ]
          }
        }
      ]
    }
  });
});
