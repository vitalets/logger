/**
 * Logger
 */

import { AsyncFn, Label, LabelOrAsyncFn, methodTime } from './time.js';

const LEVEL_METHOD = [
  { level: 'debug', method: 'debug' },
  { level: 'info', method: 'log' },
  { level: 'info', method: 'info' },
  { level: 'warn', method: 'warn' },
  { level: 'error', method: 'error' },
  { level: 'none', method: '' }
] as const;

export type LogLevel = typeof LEVEL_METHOD[ number ][ 'level' ];
export type LogMethod = Exclude<typeof LEVEL_METHOD[ number ][ 'method' ], ''>;

export type LogOptions = {
  level?: LogLevel;
  prefix?: string;
  debugBufferLength?: number;
  parent?: Logger;
}

const defaults: Required<Pick<LogOptions, 'level' | 'debugBufferLength'>> = {
  level: 'info',
  debugBufferLength: 50,
};

export class Logger {
  static defaults = defaults;
  protected options: LogOptions & Required<Omit<LogOptions, 'parent' | 'prefix'>>;
  debugBuffer: string[] = [];

  constructor(options: LogOptions = {}) {
    this.options = Object.assign({}, Logger.defaults, options);
    if (!this.options.parent) {
      this.bindMethods();
      this.bindDebugForBuffering();
    }
  }

  get level() { return this.options.level; }
  get prefix() { return this.options.prefix; }

  /** log methods: by default all are noop / proxy to parent */
  debug(...args: unknown[]) { this.defaultImpl('debug', args); }
  log(...args: unknown[]) { this.defaultImpl('log', args); }
  info(...args: unknown[]) { this.defaultImpl('info', args); }
  warn(...args: unknown[]) { this.defaultImpl('warn', args); }
  error(...args: unknown[]) { this.defaultImpl('error', args); }

  /** measure and log time of async fn */
  logTime<T>(fn: AsyncFn<T>): Promise<T>;
  logTime<T>(label: Label, fn: AsyncFn<T>): Promise<T>;
  logTime<T>(startlabel: Label, endLabel: Label, fn: AsyncFn<T>): Promise<T>;
  logTime<T>(a: LabelOrAsyncFn<T>, b?: LabelOrAsyncFn<T>, c?: AsyncFn<T>) {
    return methodTime(arg => this.log(arg), arg => this.log(arg), a, b, c);
  }
  debugTime<T>(fn: AsyncFn<T>): Promise<T>;
  debugTime<T>(label: Label, fn: AsyncFn<T>): Promise<T>;
  debugTime<T>(startlabel: Label, endLabel: Label, fn: AsyncFn<T>): Promise<T>;
  debugTime<T>(a: LabelOrAsyncFn<T>, b?: LabelOrAsyncFn<T>, c?: AsyncFn<T>) {
    return methodTime(arg => this.debug(arg), arg => this.debug(arg), a, b, c);
  }
  // First label wirtten via logger.debug() and second via logger.log().
  // Useful to keep logs clean but save message for debug when operation started.
  debugLogTime<T>(fn: AsyncFn<T>): Promise<T>;
  debugLogTime<T>(label: Label, fn: AsyncFn<T>): Promise<T>;
  debugLogTime<T>(startlabel: Label, endLabel: Label, fn: AsyncFn<T>): Promise<T>;
  debugLogTime<T>(a: LabelOrAsyncFn<T>, b?: LabelOrAsyncFn<T>, c?: AsyncFn<T>) {
    return methodTime(arg => this.debug(arg), arg => this.log(arg), a, b, c);
  }

  /** wrap logger with prefix (keep debugBuffer in original logger) */
  withPrefix(prefix: string): Logger {
    return new Logger({ prefix, parent: this });
  }

  /** Attach debug buffer to error stack and clear buffer */
  flushDebugBufferToError(e: Error): Error {
    if (this.options.parent) {
      return this.options.parent.flushDebugBufferToError(e);
    }
    if (e?.stack !== undefined) {
      e.stack = [ e.stack, ...this.debugBuffer ].join('\n');
      this.debugBuffer.length = 0;
    }
    return e;
  }

  protected bindMethods() {
    const levelIndex = LEVEL_METHOD.findIndex(({ level }) => level === this.level);
    if (levelIndex === -1) throw new Error(`Invalid log level: ${this.level}`);
    for (let i = levelIndex; i < LEVEL_METHOD.length; i++) {
      const { method } = LEVEL_METHOD[ i ];
      if (!method) continue;
      this[method] = (...args: unknown[]) => {
        console[method](...this.addPrefix(args)); // eslint-disable-line no-console
      };
    }
  }

  protected bindDebugForBuffering() {
    const { debugBufferLength } = this.options;
    if (this.level !== 'debug' && debugBufferLength > 0) {
      this.debug = (...args: unknown[]) => {
        const entry = this.addPrefix(args).map(arg => String(arg)).join(' ');
        this.debugBuffer.push(entry);
        if (this.debugBuffer.length > debugBufferLength) this.debugBuffer.shift();
      };
    }
  }

  protected addPrefix(args: unknown[]) {
    return this.prefix ? [ this.prefix, ...args ] : args;
  }

  protected defaultImpl(method: LogMethod, args: unknown[]) {
    this.options.parent?.[method](...this.addPrefix(args));
  }
}
