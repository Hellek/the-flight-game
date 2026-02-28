import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { UserEventsService } from '../UserEventsService';

const createPointerEvent = (
  overrides: Partial<PointerEvent> = {},
): PointerEvent =>
  ({
    button: 0,
    buttons: 0,
    pointerType: 'mouse',
    ...overrides,
  }) as PointerEvent;

describe('UserEventsService', () => {
  let service: UserEventsService;

  beforeEach(() => {
    service = new UserEventsService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('subscribeToDrag', () => {
    it('добавляет подписчика и возвращает функцию отписки', () => {
      const callback = vi.fn();
      const unsubscribe = service.subscribeToDrag(callback);

      expect(typeof unsubscribe).toBe('function');

      service.recordPointerDown(createPointerEvent(), { city: 'test' });
      service.recordPointerMove(createPointerEvent({ buttons: 2 }), null);
      expect(callback).toHaveBeenCalledWith('start', expect.any(Object), { city: 'test' });

      callback.mockClear();
      service.recordPointerMove(
        createPointerEvent({ buttons: 2 }),
        { point: {} },
      );
      expect(callback).toHaveBeenCalledWith('move', expect.any(Object), { point: {} });

      callback.mockClear();
      unsubscribe();
      service.recordPointerMove(createPointerEvent({ buttons: 2 }), null);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('subscribeToLongPress', () => {
    it('вызывает callback после long press на touch', () => {
      vi.useFakeTimers();
      const callback = vi.fn();
      service.subscribeToLongPress(callback);

      service.recordPointerDown(createPointerEvent({ pointerType: 'touch' }), { city: 'test' });
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(
        expect.any(Object),
        { city: 'test' },
      );

      vi.useRealTimers();
    });
  });

  describe('recordPointerDown', () => {
    it('записывает контекст при pointer down', () => {
      const callback = vi.fn();
      service.subscribeToDrag(callback);

      service.recordPointerDown(createPointerEvent(), { city: 'Moscow' });
      service.recordPointerMove(createPointerEvent({ buttons: 2 }), null);

      expect(callback).toHaveBeenCalledWith('start', expect.any(Object), { city: 'Moscow' });
    });
  });

  describe('recordPointerUp', () => {
    it('сбрасывает drag и вызывает end у подписчиков', () => {
      const callback = vi.fn();
      service.subscribeToDrag(callback);

      service.recordPointerDown(createPointerEvent(), { city: 'A' });
      service.recordPointerMove(createPointerEvent({ buttons: 2 }), null);
      expect(service.isDragInProgress()).toBe(true);

      service.recordPointerUp(createPointerEvent());
      expect(callback).toHaveBeenCalledWith('end', expect.any(Object), { city: 'A' });
      expect(service.isDragInProgress()).toBe(false);
    });
  });

  describe('recordPointerOver', () => {
    it('при drag эмитит move с контекстом при наведении', () => {
      const callback = vi.fn();
      service.subscribeToDrag(callback);

      service.recordPointerDown(createPointerEvent(), { city: 'A' });
      service.recordPointerMove(createPointerEvent({ buttons: 2 }), null);
      callback.mockClear();

      service.recordPointerOver(createPointerEvent(), { city: 'B' });
      expect(callback).toHaveBeenCalledWith('move', expect.any(Object), { city: 'B' });
    });
  });

  describe('recordPointerOut', () => {
    it('при drag эмитит move с null при уходе курсора', () => {
      const callback = vi.fn();
      service.subscribeToDrag(callback);

      service.recordPointerDown(createPointerEvent(), { city: 'A' });
      service.recordPointerMove(createPointerEvent({ buttons: 2 }), null);
      callback.mockClear();

      service.recordPointerOut(createPointerEvent());
      expect(callback).toHaveBeenCalledWith('move', expect.any(Object), null);
    });
  });

  describe('isDragInProgress', () => {
    it('возвращает false до начала drag', () => {
      expect(service.isDragInProgress()).toBe(false);
    });

    it('возвращает true во время drag', () => {
      service.recordPointerDown(createPointerEvent(), {});
      service.recordPointerMove(createPointerEvent({ buttons: 2 }), null);
      expect(service.isDragInProgress()).toBe(true);
    });

    it('возвращает false после recordPointerUp', () => {
      service.recordPointerDown(createPointerEvent(), {});
      service.recordPointerMove(createPointerEvent({ buttons: 2 }), null);
      service.recordPointerUp(createPointerEvent());
      expect(service.isDragInProgress()).toBe(false);
    });
  });
});
