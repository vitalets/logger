describe('timer', () => {

  function delay() {
    for (let i = 0; i < 10000; i++) {
      // noop
    }
  }

  it('log start and time', () => {
    const logger = new Logger({ level: 'info' });
    const stubConsole = sinon.stub(console);
    const timer = logger.logTime('foo');
    delay();
    timer.end();
    assert.deepEqual(stubConsole.log.firstCall.args, [ 'foo' ]);
    assert.match(stubConsole.log.secondCall.args[0], /foo \(\d\.\d\d\ds\)/);
  });

  it('log start without label', () => {
    const logger = new Logger({ level: 'info' });
    const stubConsole = sinon.stub(console);
    const timer = logger.logTime();
    delay();
    timer.end('foo');
    assert.match(stubConsole.log.firstCall.args[0], /foo \(\d\.\d\d\ds\)/);
  });

  it('log time with custom label', () => {
    const logger = new Logger({ level: 'info' });
    const stubConsole = sinon.stub(console);
    const timer = logger.logTime('foo');
    delay();
    timer.end('bar');
    assert.deepEqual(stubConsole.log.firstCall.args, [ 'foo' ]);
    assert.match(stubConsole.log.secondCall.args[0], /bar \(\d\.\d\d\ds\)/);
  });

});
