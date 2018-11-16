import { Fiber } from './fiber';
import { scheduleUpdate } from './reconciler';
import { VNode } from './vnode';

export abstract class Component<
  P extends Record<string, any> = Record<string, any>,
  S extends Record<string, any> = Record<string, any>
> {
  public props: P;
  public state: S;
  // tslint:disable-next-line:variable-name
  public __fiber: Fiber;
  // tslint:disable-next-line:variable-name
  public _rootContainerFiber?: Fiber;

  constructor(props: P) {
    this.props = props;
  }

  public setState(partialState: Partial<S>) {
    scheduleUpdate(this, partialState);
  }

  public abstract render(): VNode | VNode[];
}

export interface ComponentConstrucor {
  new <P>(props: P): Component<P, any>;
}
