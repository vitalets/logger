/**
 * Logger
 */

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
}
