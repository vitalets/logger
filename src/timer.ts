/**
 * Timer.
 */

export class Timer {
  protected start = Date.now();

  constructor(protected outputFn: (...args: unknown[]) => void, protected args: unknown[]) { }

  get time() {
    return Date.now() - this.start;
  }

  end(...args: unknown[]) {
    const timeStr = `(${(this.time / 1000).toFixed(3)}s)`;
    const finalArgs = (args.length ? args : this.args).concat([ timeStr ]);
    this.outputFn(...finalArgs);
  }
}
