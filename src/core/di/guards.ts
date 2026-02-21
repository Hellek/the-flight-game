import { destroy, init, update } from './symbols';
import type { Destroyable, Initable, Updatable } from './types';

export function isDestroyable(instance: unknown): instance is Destroyable {
  return (
    instance !== null &&
    typeof instance === 'object' &&
    typeof (instance as Partial<Destroyable>)[destroy] === 'function'
  );
}

export function isInitable<Props = unknown>(instance: unknown): instance is Initable<Props> {
  return (
    instance !== null &&
    typeof instance === 'object' &&
    typeof (instance as Partial<Initable<Props>>)[init] === 'function'
  );
}

export function isUpdatable<Props = unknown>(instance: unknown): instance is Updatable<Props> {
  return (
    instance !== null &&
    typeof instance === 'object' &&
    typeof (instance as Partial<Updatable<Props>>)[update] === 'function'
  );
}
