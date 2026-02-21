import { describe, expect, it } from 'vitest';
import { Props } from '../Props';

describe('Props', () => {
  it('set() устанавливает current', () => {
    const ref = new Props<{ foo: number }>();
    ref.set({ foo: 1 });
    expect(ref.current).toEqual({ foo: 1 });
  });

  it('set() перезаписывает и дополняет поля', () => {
    const ref = new Props<{ foo: number; bar?: number }>();
    ref.set({ foo: 1 });
    ref.set({ foo: 2, bar: 3 });
    expect(ref.current).toEqual({ foo: 2, bar: 3 });
  });

  it('set() удаляет ключи, отсутствующие в новом объекте', () => {
    const ref = new Props<{ foo: number; bar: number }>();
    ref.set({ foo: 1, bar: 2 });
    ref.set({ foo: 3 });
    expect(ref.current).toEqual({ foo: 3 });
    expect(Object.prototype.hasOwnProperty.call(ref.current, 'bar')).toBe(false);
  });

  it('set() с пустым объектом очищает current', () => {
    const ref = new Props<{ foo: number }>();
    ref.set({ foo: 1 });
    ref.set({} as { foo: number });
    expect(ref.current).toEqual({});
  });
});
