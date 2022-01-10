# @vitalets/logger
Yet another logger.

## Features
* log levels
* prefix
* buffer messages for debug
* types included

## Usage
```ts
import { Logger } from '@vitalets/logger';

const logger = new Logger({ prefix: '[db]:', level: 'info' });

logger.log(42);
```

## Installation
```
npm i @vitalets/logger
```

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
