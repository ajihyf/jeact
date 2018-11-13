export function arrify<T>(val: T | T[]): T[] {
  if (Array.isArray(val)) {
    return val;
  }
  return [val];
}
