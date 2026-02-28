import { makeAutoObservable } from 'mobx';
import { scope } from '@core/di';
import type { DragCallback, LongPressCallback } from './UserEventsService.types';

const LONG_PRESS_MS = 200;

/** Для pointermove: event.button=0, проверяем event.buttons (битмаска). Правая кнопка = 2. */
const isDragTrigger = (event: PointerEvent): boolean =>
  event.button === 2 || event.pointerType === 'touch' || (event.buttons & 2) !== 0;

const isTouch = (event: PointerEvent): boolean => event.pointerType === 'touch';

@scope.singleton()
export class UserEventsService {
  private dragInProgress = false;
  private pointerDownContext: unknown = null;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly dragSubscribers = new Set<DragCallback>();
  private readonly longPressSubscribers = new Set<LongPressCallback>();

  constructor() {
    makeAutoObservable(this, {
      dragSubscribers: false,
      longPressSubscribers: false,
      // TS2353: AnnotationsMap не включает private readonly поля в keyof T.
      // Приведение типа — обход. Возможна правка при обновлении MobX/TS.
    } as Parameters<typeof makeAutoObservable<object>>[1]);

    const handlePointerMove = (e: PointerEvent) => {
      if (!this.dragInProgress) this.recordPointerMove(e, null);
    };

    const handlePointerUp = (e: PointerEvent) => this.recordPointerUp(e);

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);
  }

  recordPointerDown(event: PointerEvent, context?: unknown): void {
    this.pointerDownContext = context;

    if (isTouch(event)) {
      this.longPressTimer = setTimeout(() => {
        this.longPressTimer = null;
        this.emitLongPress(event, context);
      }, LONG_PRESS_MS);
    }
  }

  recordPointerMove(event: PointerEvent, context?: unknown): void {
    if (this.dragInProgress) {
      const ctx = context === undefined ? this.pointerDownContext : context;
      this.emitDrag('move', event, ctx);
    } else if (this.pointerDownContext !== null && isDragTrigger(event)) {
      this.cancelLongPressTimer();
      this.dragInProgress = true;
      this.emitDrag('start', event, this.pointerDownContext);
    }
  }

  recordPointerUp(event: PointerEvent): void {
    this.cancelLongPressTimer();

    if (this.dragInProgress) {
      this.emitDrag('end', event, this.pointerDownContext);
      this.dragInProgress = false;
    }

    this.pointerDownContext = null;
  }

  recordPointerOver(event: PointerEvent, context?: unknown): void {
    if (this.dragInProgress) {
      const ctx = context === undefined ? this.pointerDownContext : context;
      this.emitDrag('move', event, ctx);
    }
  }

  recordPointerOut(event: PointerEvent): void {
    if (this.dragInProgress) {
      this.emitDrag('move', event, null);
    }
  }

  subscribeToDrag(callback: DragCallback): () => void {
    this.dragSubscribers.add(callback);
    return () => this.dragSubscribers.delete(callback);
  }

  subscribeToLongPress(callback: LongPressCallback): () => void {
    this.longPressSubscribers.add(callback);
    return () => this.longPressSubscribers.delete(callback);
  }

  isDragInProgress(): boolean {
    return this.dragInProgress;
  }

  private cancelLongPressTimer(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private emitDrag(phase: 'start' | 'move' | 'end', event: PointerEvent, context?: unknown): void {
    this.dragSubscribers.forEach(cb => cb(phase, event, context));
  }

  private emitLongPress(event: PointerEvent, context?: unknown): void {
    this.longPressSubscribers.forEach(cb => cb(event, context));
  }
}
