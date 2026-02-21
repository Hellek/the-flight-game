/**
 * Scope (время жизни) сущностей в DI-контейнере.
 * Маппятся на Lifecycle Tsyringe при регистрации.
 */
export const scopes = {
  /** Новый инстанс при каждом resolve */
  TRANSIENT: 'TRANSIENT',
  /** Один инстанс на контейнер (в дочерних — свой) */
  CONTAINER: 'CONTAINER',
  /** Один инстанс на всё приложение */
  SINGLETON: 'SINGLETON',
} as const

export type Scope = (typeof scopes)[keyof typeof scopes]
