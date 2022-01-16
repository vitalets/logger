describe('log time', () => {

  async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const fn = () => wait(10).then(() => 42);

  it('default label', async () => {
    const logger = new Logger({ level: 'info' });
    const stubConsole = sinon.stub(console);
    const res = await logger.logTime(fn);
    assert.equal(res, 42);
    sinon.assert.callCount(stubConsole.log, 2);
    assert.equal(stubConsole.log.getCall(0).args.join(' '), fn.toString());
    assert.ok(stubConsole.log.getCall(1).args.join(' ').includes(fn.toString()));
    assert.match(stubConsole.log.getCall(1).args.join(' '), / \(\d\.\d\d\ds\)$/);
  });

  it('custom label', async () => {
    const logger = new Logger({ level: 'info' });
    const stubConsole = sinon.stub(console);
    const res = await logger.logTime('foo', fn);
    assert.equal(res, 42);
    sinon.assert.callCount(stubConsole.log, 2);
    assert.equal(stubConsole.log.getCall(0).args.join(' '), 'foo');
    assert.ok(stubConsole.log.getCall(1).args.join(' ').includes('foo'));
    assert.match(stubConsole.log.getCall(1).args.join(' '), / \(\d\.\d\d\ds\)$/);
  });

  it('custom startLabel, endLabel', async () => {
    const logger = new Logger({ level: 'info' });
    const stubConsole = sinon.stub(console);
    const res = await logger.logTime('foo', 'bar', fn);
    assert.equal(res, 42);
    sinon.assert.callCount(stubConsole.log, 2);
    assert.equal(stubConsole.log.getCall(0).args.join(' '), 'foo');
    assert.ok(stubConsole.log.getCall(1).args.join(' ').includes('bar'));
    assert.match(stubConsole.log.getCall(1).args.join(' '), / \(\d\.\d\d\ds\)$/);
  });

  it('null label', async () => {
    const logger = new Logger({ level: 'info' });
    const stubConsole = sinon.stub(console);
    const res = await logger.logTime(null, fn);
    assert.equal(res, 42);
    sinon.assert.callCount(stubConsole.log, 1);
    assert.ok(stubConsole.log.getCall(0).args.join(' ').includes(fn.toString()));
    assert.match(stubConsole.log.getCall(0).args.join(' '), / \(\d\.\d\d\ds\)$/);
  });

  it('null startLabel', async () => {
    const logger = new Logger({ level: 'info' });
    const stubConsole = sinon.stub(console);
    const res = await logger.logTime(null, 'bar', fn);
    assert.equal(res, 42);
    sinon.assert.callCount(stubConsole.log, 1);
    assert.ok(stubConsole.log.getCall(0).args.join(' ').includes('bar'));
    assert.match(stubConsole.log.getCall(0).args.join(' '), / \(\d\.\d\d\ds\)$/);
  });

  it('null endLabel', async () => {
    const logger = new Logger({ level: 'info' });
    const stubConsole = sinon.stub(console);
    const res = await logger.logTime('foo', null, fn);
    assert.equal(res, 42);
    sinon.assert.callCount(stubConsole.log, 2);
    assert.equal(stubConsole.log.getCall(0).args.join(' '), 'foo');
    assert.ok(stubConsole.log.getCall(1).args.join(' ').includes(fn.toString()));
    assert.match(stubConsole.log.getCall(1).args.join(' '), / \(\d\.\d\d\ds\)$/);
  });

  it('debug time', async () => {
    const logger = new Logger({ level: 'debug' });
    const stubConsole = sinon.stub(console);
    const res = await logger.debugTime('foo', fn);
    assert.equal(res, 42);
    sinon.assert.callCount(stubConsole.debug, 2);
    assert.equal(stubConsole.debug.getCall(0).args.join(' '), 'foo');
    assert.ok(stubConsole.debug.getCall(1).args.join(' ').includes('foo'));
    assert.match(stubConsole.debug.getCall(1).args.join(' '), / \(\d\.\d\d\ds\)$/);
  });

  it('prefix', async () => {
    const logger = new Logger({ level: 'info' }).withPrefix('xxx');
    const stubConsole = sinon.stub(console);
    const res = await logger.logTime('foo', fn);
    assert.equal(res, 42);
    sinon.assert.callCount(stubConsole.log, 2);
    assert.equal(stubConsole.log.getCall(0).args.join(' '), 'xxx foo');
    assert.ok(stubConsole.log.getCall(1).args.join(' ').includes('xxx foo'));
    assert.match(stubConsole.log.getCall(1).args.join(' '), / \(\d\.\d\d\ds\)$/);
  });

});
