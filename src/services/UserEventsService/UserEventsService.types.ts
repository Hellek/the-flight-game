export type DragPhase = 'start' | 'move' | 'end';

export type DragCallback = (phase: DragPhase, event: PointerEvent, context?: unknown) => void;

export type LongPressCallback = (event: PointerEvent, context?: unknown) => void;
