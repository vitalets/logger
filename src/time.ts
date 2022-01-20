/**
 * Measure time of async fn.
 */

export type Label = string | null;
export type AsyncFn<T> = () => Promise<T>;
export type LabelOrAsyncFn<T> = Label | AsyncFn<T>;

/**
 * Universal measuring function to match all overloaded signatures.
 */
// eslint-disable-next-line max-statements
export async function methodTime<T>(
  outputStart: (arg: unknown) => void,
  outputEnd: (arg: unknown) => void,
  a: LabelOrAsyncFn<T>,
  b?: LabelOrAsyncFn<T>,
  c?: AsyncFn<T>
) {
  const args = [ a, b, c ];
  const fnIndex = args.findIndex(a => typeof a === 'function');
  const fn = args[fnIndex] as AsyncFn<T>;
  const defaultLabel = fn?.toString();
  const label1 = fnIndex > 0 ? a : defaultLabel;
  const label2 = fnIndex > 0 ? (fnIndex === 1 ? label1 : b) : defaultLabel;
  if (label1) outputStart(label1);
  const start = Date.now();
  try {
    return await fn();
  } finally {
    const duration = ((Date.now() - start) / 1000).toFixed(3);
    outputEnd(`${label2 || defaultLabel} (${duration}s)`);
  }
}
