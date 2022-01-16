import assert from 'assert';
import sinon from 'sinon';
import { Logger } from '../src/index.js';

type Assert = typeof assert.strict;
type sinon = typeof sinon;
type LoggerType = typeof Logger;

declare global {
  const assert: Assert;
  const sinon: sinon;
  const Logger: LoggerType;
}

Object.assign(global, {
  assert: assert.strict,
  sinon,
  Logger,
});

afterEach(() => {
  sinon.restore();
});
