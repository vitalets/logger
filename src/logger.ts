/**
 * Logger (without prefix)
 */

import { LoggerWithPrefix } from './logger-with-prefix.js';
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
  /** number of buffered debug calls */
  debugBufferLength?: number;
}

const defaults: Required<LogOptions> = {
  level: 'info',
  debugBufferLength: 50,
};

export interface ILogger {
  debugBuffer: string[];
  level: LogLevel;

  /** log methods */
  debug(..._args: unknown[]): void;
  log(..._args: unknown[]): void;
  info(..._args: unknown[]): void;
  warn(..._args: unknown[]): void;
  error(..._args: unknown[]): void;

  /** measure and log time of async fn */
  logTime<T>(fn: AsyncFn<T>): Promise<T>;
  logTime<T>(label: Label, fn: AsyncFn<T>): Promise<T>;
  logTime<T>(startlabel: Label, endLabel: Label, fn: AsyncFn<T>): Promise<T>;
  debugTime<T>(fn: AsyncFn<T>): Promise<T>;
  debugTime<T>(label: Label, fn: AsyncFn<T>): Promise<T>;
  debugTime<T>(startlabel: Label, endLabel: Label, fn: AsyncFn<T>): Promise<T>;

  /** wrap logger with prefix */
  withPrefix(prefix: string): LoggerWithPrefix;

  /** Attach debug buffer to error stack and clear buffer */
  flushDebugBufferToError(e: Error): Error;
}

export class Logger implements ILogger {
  static defaults = defaults;
  private options: Required<LogOptions>;
  debugBuffer: string[] = [];

  constructor(options: LogOptions = {}) {
    this.options = Object.assign({}, Logger.defaults, options);
    this.bindMethods();
    this.bindDebugForBuffering();
  }

  get level() {
    return this.options.level;
  }

  /** all methods are noop by default */
  debug(..._args: unknown[]) { } // eslint-disable-line @typescript-eslint/no-unused-vars
  log(..._args: unknown[]) { }   // eslint-disable-line @typescript-eslint/no-unused-vars
  info(..._args: unknown[]) { }  // eslint-disable-line @typescript-eslint/no-unused-vars
  warn(..._args: unknown[]) { }  // eslint-disable-line @typescript-eslint/no-unused-vars
  error(..._args: unknown[]) { } // eslint-disable-line @typescript-eslint/no-unused-vars

  async logTime<T>(a: LabelOrAsyncFn<T>, b?: LabelOrAsyncFn<T>, c?: AsyncFn<T>) {
    return methodTime(arg => this.log(arg), a, b, c);
  }

  async debugTime<T>(a: LabelOrAsyncFn<T>, b?: LabelOrAsyncFn<T>, c?: AsyncFn<T>) {
    return methodTime(arg => this.debug(arg), a, b, c);
  }

  withPrefix(prefix: string): LoggerWithPrefix {
    return new LoggerWithPrefix(this, prefix);
  }

  flushDebugBufferToError(e: Error) {
    if (e?.stack !== undefined) {
      e.stack = [ e.stack, ...this.debugBuffer ].join('\n');
      this.debugBuffer.length = 0;
    }
    return e;
  }

  protected bindMethods() {
    const levelIndex = LEVEL_METHOD.findIndex(({ level }) => level === this.level);
    for (let i = levelIndex; i < LEVEL_METHOD.length; i++) {
      const { method } = LEVEL_METHOD[ i ];
      if (!method) continue;
      this[method] = (...args: unknown[]) => {
        // eslint-disable-next-line no-console
        console[method](...args);
      };
    }
  }

  protected bindDebugForBuffering() {
    const { debugBufferLength } = this.options;
    if (this.level !== 'debug' && debugBufferLength > 0) {
      this.debug = (...args: unknown[]) => {
        const entry = args.map(arg => String(arg)).join(' ');
        this.debugBuffer.push(entry);
        if (this.debugBuffer.length > debugBufferLength) this.debugBuffer.shift();
      };
    }
  }
}
