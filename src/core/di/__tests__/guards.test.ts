import { describe, expect, it } from 'vitest';
import { isDestroyable, isInitable, isUpdatable } from '../guards';
import { destroy, init, update } from '../symbols';

describe('guards', () => {
  describe('isDestroyable', () => {
    it('returns true for object with [destroy] function', () => {
      const obj = { [destroy]: () => {} };
      expect(isDestroyable(obj)).toBe(true);
    });

    it('returns false for null and undefined', () => {
      expect(isDestroyable(null)).toBe(false);
      expect(isDestroyable(undefined)).toBe(false);
    });

    it('returns false for object without [destroy]', () => {
      expect(isDestroyable({})).toBe(false);
      expect(isDestroyable({ destroy: 1 })).toBe(false);
      expect(isDestroyable({ [destroy]: 'not a function' })).toBe(false);
    });

    it('returns false for primitives', () => {
      expect(isDestroyable(0)).toBe(false);
      expect(isDestroyable('')).toBe(false);
      expect(isDestroyable(true)).toBe(false);
    });
  });

  describe('isInitable', () => {
    it('returns true for object with [init] function', () => {
      const obj = { [init]: () => {} };
      expect(isInitable(obj)).toBe(true);
    });

    it('returns false for null and object without [init]', () => {
      expect(isInitable(null)).toBe(false);
      expect(isInitable({})).toBe(false);
      expect(isInitable({ [init]: 1 })).toBe(false);
    });
  });

  describe('isUpdatable', () => {
    it('returns true for object with [update] function', () => {
      const obj = { [update]: () => {} };
      expect(isUpdatable(obj)).toBe(true);
    });

    it('returns false for null and object without [update]', () => {
      expect(isUpdatable(null)).toBe(false);
      expect(isUpdatable({})).toBe(false);
      expect(isUpdatable({ [update]: 1 })).toBe(false);
    });
  });
});
