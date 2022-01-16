# @vitalets/logger
Pure typescript logger with support of prefix, levels, time measure and debug buffering.

## Features
* prefix
* log levels
* time measure
* buffering debug messages

## Usage
```ts
import { Logger } from '@vitalets/logger';

// create logger with prefix and level
const logger = new Logger({ level: 'info' }).withPrefix('[db]:');

// log as usual
logger.log(42);
logger.info(42);
logger.warn(42);
logger.error(42);

// measure time
const result = await logger.logTime('fetching...',
  () => fetch('http://example.com')
);
// OUTPUT:
// 'fetching...'
// 'fetching... (1.234s)'

// buffer debug messages
try {
  logger.debug('hello'); // -> outputs nothing as level=info, but stores message in logger.debugBuffer
  throw new Error('my error');
} catch (e) {
  throw logger.flushDebugBufferToError(e); // attaches debug messages to error stack
}
```

## Installation
```
npm i @vitalets/logger
```
> Note: this package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)

## API
tbd

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
