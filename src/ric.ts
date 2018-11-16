export interface Deadline {
  timeRemaining: () => number;
}

declare global {
  interface Window {
    requestIdleCallback(cb: RICCallback): number;
  }
}

type RICCallback = (ddl: Deadline) => void;

export const rIC: (cb: RICCallback) => number = window.requestIdleCallback;
