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

export const defaults: Required<LogOptions> = {
  level: 'info',
  prefix: '',
  debugBufferLength: 50,
};

export class Logger {
  options: Required<LogOptions>;
  debugBuffer: string[] = [];

  constructor(options: LogOptions = {}) {
    this.options = Object.assign({}, defaults, options);
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

  /** timer methods: output label and create timer */
  debugTime(label?: string) { return this.startTimer('debug', label); }
  logTime(label?: string) { return this.startTimer('log', label); }
  infoTime(label?: string) { return this.startTimer('info', label); }
  warnTime(label?: string) { return this.startTimer('warn', label); }
  errorTime(label?: string) { return this.startTimer('error', label); }

  flushDebugBufferToError(e: Error) {
    if (e?.stack) {
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
        return this;
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
        return this;
      };
    }
  }

  protected getArgsWithPrefix(args: unknown[]) {
    return this.prefix ? [ this.prefix, ...args ] : args;
  }

  protected startTimer(method: LogMethod, label?: string) {
    if (label !== undefined) this[method](label);
    return new Timer((msg: string) => this[method](msg), label);
  }
}
