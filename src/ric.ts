export interface Deadline {
  timeRemaining: () => number;
}

type RICCallback = (ddl: Deadline) => void;

export const rIC: (cb: RICCallback) => number = (window as any)
  .requestIdleCallback;
