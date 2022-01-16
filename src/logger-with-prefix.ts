/**
 * Logger with prefix.
 * Wraps original logger without inheritance (keep debugBuffer in single place).
 */
import type { ILogger, LogMethod } from './logger.js';
import { AsyncFn, LabelOrAsyncFn, methodTime } from './time.js';

export class LoggerWithPrefix implements ILogger {
  constructor(private logger: ILogger, private prefix: string) { }

  get level() { return this.logger.level; }
  get debugBuffer() { return this.logger.debugBuffer; }
  flushDebugBufferToError(e: Error) { return this.logger.flushDebugBufferToError(e); }

  debug(..._args: unknown[]) { return this.output('debug', _args); }
  log(..._args: unknown[]) { return this.output('log', _args); }
  info(..._args: unknown[]) { return this.output('info', _args); }
  warn(..._args: unknown[]) { return this.output('warn', _args); }
  error(..._args: unknown[]) { return this.output('error', _args); }

  withPrefix(prefix: string) {
    prefix = [ this.prefix, prefix ].filter(Boolean).join(' ');
    return new LoggerWithPrefix(this.logger, prefix);
  }

  async logTime<T>(a: LabelOrAsyncFn<T>, b?: LabelOrAsyncFn<T>, c?: AsyncFn<T>) {
    return methodTime(arg => this.log(arg), a, b, c);
  }

  async debugTime<T>(a: LabelOrAsyncFn<T>, b?: LabelOrAsyncFn<T>, c?: AsyncFn<T>) {
    return methodTime(arg => this.debug(arg), a, b, c);
  }

  protected output(method: LogMethod, args: unknown[]) {
    this.logger[method](this.prefix, ...args);
  }
}
