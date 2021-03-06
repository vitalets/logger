describe('logger', () => {

  it('call console methods', () => {
    const logger = new Logger({ level: 'debug' });
    const stubConsole = sinon.stub(console);
    logger.debug('debug', 42);
    logger.log('log', 42);
    logger.info('info', 42);
    logger.warn('warn', 42);
    logger.error('error', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.debug, 'debug', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.log, 'log', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.info, 'info', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.warn, 'warn', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.error, 'error', 42);
  });

  it('level', () => {
    const logger = new Logger({ level: 'info' });
    const stubConsole = sinon.stub(console);
    logger.debug('debug', 42);
    logger.log('log', 42);
    logger.info('info', 42);
    logger.warn('warn', 42);
    logger.error('error', 42);
    sinon.assert.notCalled(stubConsole.debug);
    sinon.assert.calledOnceWithMatch(stubConsole.log, 'log', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.info, 'info', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.warn, 'warn', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.error, 'error', 42);
  });

  it('prefix', () => {
    const logger = new Logger({ level: 'info', prefix: 'xxx' });
    const stubConsole = sinon.stub(console);
    logger.debug('debug', 42);
    logger.log('log', 42);
    logger.info('info', 42);
    logger.warn('warn', 42);
    logger.error('error', 42);
    sinon.assert.notCalled(stubConsole.debug);
    sinon.assert.calledOnceWithMatch(stubConsole.log, 'xxx', 'log', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.info, 'xxx', 'info', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.warn, 'xxx', 'warn', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.error, 'xxx', 'error', 42);
  });

  it('withPrefix', () => {
    const logger = new Logger().withPrefix('xxx');
    const stubConsole = sinon.stub(console);
    logger.debug('debug', 42);
    logger.log('log', 42);
    logger.info('info', 42);
    logger.warn('warn', 42);
    logger.error('error', 42);
    sinon.assert.notCalled(stubConsole.debug);
    sinon.assert.calledOnceWithMatch(stubConsole.log, 'xxx', 'log', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.info, 'xxx', 'info', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.warn, 'xxx', 'warn', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.error, 'xxx', 'error', 42);
  });

  it('prefix + withPrefix', () => {
    const logger = new Logger({ prefix: 'xxx' }).withPrefix('yyy');
    const stubConsole = sinon.stub(console);
    logger.log('log', 42);
    assert.deepEqual(stubConsole.log.getCall(0).args, [ 'xxx', 'yyy', 'log', 42 ]);
  });

  it('prefix + withPrefix + withPrefix', () => {
    const logger = new Logger({ prefix: 'xxx' }).withPrefix('yyy').withPrefix('zzz');
    const stubConsole = sinon.stub(console);
    logger.log('log', 42);
    assert.deepEqual(stubConsole.log.getCall(0).args, [ 'xxx', 'yyy', 'zzz', 'log', 42 ]);
  });

  it('debug buffer', () => {
    const logger = new Logger({ level: 'info' });
    logger.debug('debug', 42);
    logger.debug('foo');
    assert.deepEqual(logger.debugBuffer, [
      'debug 42',
      'foo',
    ]);
  });

  it('flushDebugBufferToError', () => {
    const logger = new Logger({ level: 'info' });
    logger.debug('debug', 42);
    logger.debug('foo');
    const e = new Error('bar');
    logger.flushDebugBufferToError(e);
    assert.deepEqual(e.stack!.split('\n').slice(-2), [
      'debug 42',
      'foo',
    ]);
    assert.deepEqual(logger.debugBuffer, []);
  });

  it('defaults', () => {
    sinon.stub(Logger.defaults, 'level').get(() => 'debug');
    const logger = new Logger();
    const stubConsole = sinon.stub(console);
    logger.debug('log', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.debug, 'log', 42);
  });

  it('invalid level', () => {
    // @ts-expect-error level foo
    assert.throws(() => new Logger({ level: 'foo' }), /Invalid log level: foo/);
  });

});
