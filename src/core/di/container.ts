import {
  container as tsyringeContainer,
  type DependencyContainer,
  Lifecycle,
} from 'tsyringe'

export type Constructor<T = unknown> = new (...args: unknown[]) => T

/**
 * Обёртка над Tsyringe: корневой и дочерние контейнеры,
 * resolve, создание дочернего контейнера и его очистка.
 */
export class DIContainer {
  readonly #name: string
  readonly #parent: DIContainer | null
  readonly #container: DependencyContainer
  readonly #children = new Map<string, DIContainer>()
  #destroyed = false

  constructor(parent: DIContainer | null, name: string) {
    this.#parent = parent
    this.#name = name
    this.#container =
      parent === null
        ? tsyringeContainer
        : (parent.container.createChildContainer() as DependencyContainer)
  }

  /** Имя контейнера (для отладки и тестов) */
  get name(): string {
    return this.#name
  }

  /** Внутренний контейнер Tsyringe для register/resolve */
  get container(): DependencyContainer {
    return this.#container
  }

  /** Резолв сущности из контейнера */
  resolve<T>(token: Constructor<T>): T {
    if (this.#destroyed) {
      throw new Error(`[DI] Container "${this.#name}" is destroyed`)
    }
    return this.#container.resolve(token) as T
  }

  /** Есть ли уже дочерний контейнер с таким именем */
  childrenExists(name: string): boolean {
    return this.#children.has(name)
  }

  /** Создать дочерний контейнер */
  child(name: string): DIContainer {
    if (this.#destroyed) {
      throw new Error(`[DI] Container "${this.#name}" is destroyed`)
    }

    const existing = this.#children.get(name)
    if (existing) return existing
    const childContainer = new DIContainer(this, name)
    this.#children.set(name, childContainer)
    return childContainer
  }

  /** Очистка дочернего контейнера (вызывать при размонтировании) */
  destroy(): void {
    if (this.#destroyed) return
    for (const child of this.#children.values()) {
      child.destroy()
    }

    this.#children.clear()
    if (this.#parent !== null && 'clearInstances' in this.#container) {
      (this.#container as { clearInstances?: () => void }).clearInstances?.()
    }

    this.#destroyed = true
  }
}

const root = new DIContainer(null, 'root')

/** Корневой DI-контейнер приложения */
export const rootContainer = root

/** Маппинг scope на Lifecycle Tsyringe для register */
export function scopeToLifecycle(scope: string): Lifecycle {
  switch (scope) {
    case 'TRANSIENT':
      return Lifecycle.Transient
    case 'CONTAINER':
      return Lifecycle.ContainerScoped
    case 'SINGLETON':
      return Lifecycle.Singleton
    default:
      return Lifecycle.Transient
  }
}
