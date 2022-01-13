/**
 * Logger
 */

import { Timer } from './timer.js';

/* eslint-disable @typescript-eslint/no-unused-vars */

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
  /** number of buffered debug calls */
  debugBufferLength?: number;
}

export class Logger {
  static defaults: Required<LogOptions> = {
    level: 'info',
    prefix: '',
    debugBufferLength: 50,
  };
  options: Required<LogOptions>;
  debugBuffer: string[] = [];

  constructor(options: LogOptions = {}) {
    this.options = Object.assign({}, Logger.defaults, options);
    this.bindMethods();
    this.bindDebugForBuffering();
  }

  get prefix() {
    return this.options.prefix;
  }

  get level() {
    return this.options.level;
  }

  /** all methods are noop by default */
  debug(..._args: unknown[]) { }
  log(..._args: unknown[]) { }
  info(..._args: unknown[]) { }
  warn(..._args: unknown[]) { }
  error(..._args: unknown[]) { }

  /** timer methods: log args and create timer */
  debugTimer(..._args: unknown[]) { return this.startTimer('debug', _args); }
  logTimer(..._args: unknown[]) { return this.startTimer('log', _args); }
  infoTimer(..._args: unknown[]) { return this.startTimer('info', _args); }

  /**
   * Attach debug buffer to error stack and clear buffer.
   */
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
        console[method](...this.getArgsWithPrefix(args));
      };
    }
  }

  protected bindDebugForBuffering() {
    const { debugBufferLength } = this.options;
    if (this.level !== 'debug' && debugBufferLength > 0) {
      this.debug = (...args: unknown[]) => {
        const entry = this.getArgsWithPrefix(args).map(arg => String(arg)).join(' ');
        this.debugBuffer.push(entry);
        if (this.debugBuffer.length > debugBufferLength) this.debugBuffer.shift();
      };
    }
  }

  protected getArgsWithPrefix(args: unknown[]) {
    return this.prefix ? [ this.prefix, ...args ] : args;
  }

  protected startTimer(method: LogMethod, args: unknown[]) {
    if (args.length) this[method](...args);
    return new Timer((...args: unknown[]) => this[method](...args), args);
  }
}
