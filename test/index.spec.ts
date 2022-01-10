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
    const logger = new Logger({ prefix: 'foo' });
    const stubConsole = sinon.stub(console);
    logger.log('log', 42);
    sinon.assert.calledOnceWithMatch(stubConsole.log, 'foo', 'log', 42);
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

});
