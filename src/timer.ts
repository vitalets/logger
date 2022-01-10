/**
 * Timer.
 */

export class Timer {
  protected start = Date.now();

  constructor(protected outputFn: (msg: string) => void, protected label?: string) { }

  get time() {
    return Date.now() - this.start;
  }

  end(label?: string) {
    const msg = [
      label || this.label,
      `(${(this.time / 1000).toFixed(3)}s)`,
    ].filter(Boolean).join(' ');
    this.outputFn(msg);
  }
}
