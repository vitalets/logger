describe('timer', () => {

  function delay() {
    for (let i = 0; i < 10000; i++) {
      // noop
    }
  }

  it('log start and time', () => {
    const logger = new Logger({ level: 'info' });
    const stubConsole = sinon.stub(console);
    const timer = logger.logTimer('foo');
    delay();
    timer.end();
    assert.equal(stubConsole.log.firstCall.args.join(' '), 'foo');
    assert.match(stubConsole.log.secondCall.args.join(' '), /foo \(\d\.\d\d\ds\)/);
  });

  it('log start without label', () => {
    const logger = new Logger({ level: 'info' });
    const stubConsole = sinon.stub(console);
    const timer = logger.logTimer();
    delay();
    timer.end('foo');
    assert.match(stubConsole.log.firstCall.args.join(' '), /foo \(\d\.\d\d\ds\)/);
  });

  it('log time with custom label', () => {
    const logger = new Logger({ level: 'info' });
    const stubConsole = sinon.stub(console);
    const timer = logger.logTimer('foo');
    delay();
    timer.end('bar');
    assert.equal(stubConsole.log.firstCall.args.join(' '), 'foo');
    assert.match(stubConsole.log.secondCall.args.join(' '), /bar \(\d\.\d\d\ds\)/);
  });

});
