// tslint-disable
const deadline = {
  timeRemaining: () => 1000
};

declare var global: any;
global.requestIdleCallback = function requestIdleCallback(fn: any) {
  fn(deadline);
};
