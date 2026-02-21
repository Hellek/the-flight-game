import {
  container as tsyringeContainer,
  type DependencyContainer,
  Lifecycle,
} from 'tsyringe';
import { isDestroyable } from './guards';
import { resolveTransformer } from './internal/resolve-transformer';
import { destroy } from './symbols';
import type { Constructor, Destroyable } from './types';

export type { Constructor } from './types';

/**
 * Обёртка над Tsyringe: корневой и дочерние контейнеры,
 * resolve, создание дочернего контейнера и его очистка.
 */
export class DIContainer {
  readonly #name: string;
  readonly #parent: DIContainer | null;
  readonly #container: DependencyContainer;
  readonly #children = new Map<string, DIContainer>();
  readonly #instances = new Set<Destroyable>();
  #destroyed = false;

  constructor(parent: DIContainer | null, name: string) {
    this.#parent = parent;
    this.#name = name;
    this.#container =
      parent === null
        ? tsyringeContainer
        : (parent.container.createChildContainer() as DependencyContainer);
  }

  /** Имя контейнера (для отладки и тестов) */
  get name(): string {
    return this.#name;
  }

  /** Внутренний контейнер Tsyringe для register/resolve */
  get container(): DependencyContainer {
    return this.#container;
  }

  /** Резолв сущности из контейнера */
  resolve<T>(token: Constructor<T>): T {
    if (this.#destroyed) {
      throw new Error(`[DI] Container "${this.#name}" is destroyed`);
    }

    const instance = this.#container.resolve(token) as T;
    if (isDestroyable(instance)) {
      this.#instances.add(instance);
    }
    return instance;
  }

  /**
   * Резолв с трансформацией аргументов конструктора (например, подстановка Props перед созданием).
   */
  resolveWithTransforms<T>(
    token: Constructor<T>,
    transform: (args: unknown[]) => void,
  ): T {
    if (this.#destroyed) {
      throw new Error(`[DI] Container "${this.#name}" is destroyed`);
    }

    const unapply = resolveTransformer.apply(token as Constructor<unknown>, transform as (args: unknown[]) => void);

    try {
      return this.resolve(token);
    } finally {
      unapply();
    }
  }

  /** Вызвать [destroy] у инстанса и убрать его из учёта */
  destroyInstance(instance: Partial<Destroyable>): void {
    if (!this.#instances.has(instance as Destroyable)) return;
    if (isDestroyable(instance)) {
      instance[destroy]();
    }

    this.#instances.delete(instance as Destroyable);
  }

  /** Есть ли уже дочерний контейнер с таким именем */
  childrenExists(name: string): boolean {
    return this.#children.has(name);
  }

  /** Создать дочерний контейнер */
  child(name: string): DIContainer {
    if (this.#destroyed) {
      throw new Error(`[DI] Container "${this.#name}" is destroyed`);
    }

    const existing = this.#children.get(name);
    if (existing) return existing;
    const childContainer = new DIContainer(this, name);
    this.#children.set(name, childContainer);
    return childContainer;
  }

  /** Очистка дочернего контейнера (вызывать при размонтировании) */
  destroy(): void {
    if (this.#parent === null) {
      throw new Error('[DI] Cannot destroy root container');
    }
    if (this.#destroyed) return;
    for (const child of this.#children.values()) {
      child.destroy();
    }

    this.#children.clear();

    for (const instance of Array.from(this.#instances)) {
      this.destroyInstance(instance);
    }
    if ('clearInstances' in this.#container) {
      (this.#container as { clearInstances?: () => void }).clearInstances?.();
    }

    this.#destroyed = true;
  }
}

const root = new DIContainer(null, 'root');

/** Корневой DI-контейнер приложения */
export const rootContainer = root;

/** Маппинг scope на Lifecycle Tsyringe для register */
export function scopeToLifecycle(scope: string): Lifecycle {
  switch (scope) {
    case 'TRANSIENT':
      return Lifecycle.Transient;
    case 'CONTAINER':
      return Lifecycle.ContainerScoped;
    case 'SINGLETON':
      return Lifecycle.Singleton;
    default:
      return Lifecycle.Transient;
  }
}
