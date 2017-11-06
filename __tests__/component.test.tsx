// tslint:disable:max-classes-per-file
import { Component, h, render } from '../src/jeact';

let root: HTMLElement;

beforeAll(() => {
  root = document.createElement('div');
  document.body.appendChild(root);
});

it('renders a component', () => {
  class Foo extends Component<{}, {}> {
    public render() {
      return (
        <div class={{ good: true, hello: false }}>
          <a attrs={{ href: '/' }} />
        </div>
      );
    }
  }

  render(<Foo />, root);
  expect(root.innerHTML).toEqual('<div class="good"><a href="/"></a></div>');
});

it('renders a component with props', () => {
  class Foo extends Component<{ name: string }, {}> {
    public render() {
      return (
        <div class={{ good: true, hello: false }}>
          <a attrs={{ href: '/' }} />
          <span>{this.props.name}</span>
        </div>
      );
    }
  }

  render(<Foo name="hi" />, root);
  expect(root.innerHTML).toEqual(
    '<div class="good"><a href="/"></a><span>hi</span></div>'
  );
});

it('can set state', () => {
  class Foo extends Component<{}, { count: number }> {
    constructor(props: any) {
      super(props);
      this.state = { count: 0 };
      this.handleClick = this.handleClick.bind(this);
    }

    public render() {
      return <div on={{ click: this.handleClick }}>{this.state.count}</div>;
    }

    private handleClick() {
      this.setState({ count: this.state.count + 1 });
    }
  }

  render(<Foo />, root);
  expect(root.innerHTML).toEqual('<div>0</div>');
  (root.firstChild as HTMLElement).click();
  expect(root.innerHTML).toEqual('<div>1</div>');
});
