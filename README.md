# @vitalets/logger
Pure typescript logger with support of prefix, levels, timers and buffering.

## Features
* prefix
* log levels
* timers
* buffering of debug messages

## Usage
```ts
import { Logger } from '@vitalets/logger';

// create logger with prefix and level
const logger = new Logger({ prefix: '[db]:', level: 'info' });

// log as usual
logger.log(42);
logger.info(42);
logger.warn(42);
logger.error(42);

// buffer debug messages
try {
  logger.debug('hello'); // -> outputs nothing as level=info, but stores message in logger.debugBuffer
  throw new Error('my error');
} catch (e) {
  throw logger.flushDebugBufferToError(e); // attaches debug messages to error stack
}

// measure time
const timer = logger.logTimer('uploading file...'); // -> 'uploading file...'
...
timer.end(); // -> 'uploading file... (1.234s)'
```

## Installation
```
npm i @vitalets/logger
```
> Note: this package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
