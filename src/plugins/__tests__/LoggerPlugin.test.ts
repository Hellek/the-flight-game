import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { LoggerPlugin } from '../LoggerPlugin';

describe('LoggerPlugin', () => {
  const plugin = new LoggerPlugin();

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('log("info", message) вызывает console.info с объектом level и message', () => {
    plugin.log('info', 'test message');
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledWith({ level: 'info', message: 'test message' });
  });

  it('log("warn", message) вызывает console.warn', () => {
    plugin.log('warn', 'warning');
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith({ level: 'warn', message: 'warning' });
  });

  it('log("error", message) вызывает console.error', () => {
    plugin.log('error', 'error message');
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith({ level: 'error', message: 'error message' });
  });

  it('log с payload добавляет payload в объект', () => {
    plugin.log('info', 'msg', { foo: 42 });
    expect(console.info).toHaveBeenCalledWith({
      level: 'info',
      message: 'msg',
      payload: { foo: 42 },
    });
  });

  it('error(message) вызывает log с level "error"', () => {
    plugin.error('something failed');
    expect(console.error).toHaveBeenCalledWith({
      level: 'error',
      message: 'something failed',
    });
  });

  it('error(message, { throw: true }) выбрасывает Error', () => {
    expect(() => plugin.error('fail', { throw: true })).toThrow('fail');
    expect(console.error).toHaveBeenCalled();
  });

  it('error(message, { payload }) передаёт payload в log', () => {
    plugin.error('err', { payload: { code: 500 } });
    expect(console.error).toHaveBeenCalledWith({
      level: 'error',
      message: 'err',
      payload: { code: 500 },
    });
  });
});
