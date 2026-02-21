import type { destroy, init, update } from './symbols';

export interface Destroyable {
  [destroy](): void
}

export interface Initable<PropsType> {
  [init](props: PropsType): Promise<void> | void
}

export interface Updatable<PropsType> {
  [update](props: PropsType): void
}

/** Конструктор, резолвимый контейнером (Tsyringe инжектирует зависимости). */
export type Constructor<T = unknown> = new (...args: unknown[]) => T;

export type AbstractConstructor<T = unknown> = abstract new (...args: unknown[]) => T;

export type AnyConstructor<T = unknown> = Constructor<T> | AbstractConstructor<T>;
