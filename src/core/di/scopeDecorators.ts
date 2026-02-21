import { injectable, Lifecycle, scoped, singleton } from 'tsyringe'
import { type Scope, scopes } from './scope'

type Constructor = new (...args: unknown[]) => unknown

function mapToTsyringe(scope: Scope): (target: Constructor) => void {
  switch (scope) {
    case scopes.TRANSIENT:
      return injectable()
    case scopes.CONTAINER:
      return scoped(Lifecycle.ContainerScoped)
    case scopes.SINGLETON:
      return singleton()
    default:
      return injectable()
  }
}

/**
 * Декораторы scope по аналогии с vkcom: явно задают время жизни сущности в контейнере.
 * ViewModel виджетов — @scope.transient(); сервисы — @scope.container() или @scope.singleton().
 */
export const scope = {
  /** Новый инстанс при каждом resolve (для ViewModel виджетов) */
  transient: () => mapToTsyringe(scopes.TRANSIENT),
  /** Один инстанс на контейнер (для сервисов) */
  container: () => mapToTsyringe(scopes.CONTAINER),
  /** Один инстанс на всё приложение */
  singleton: () => mapToTsyringe(scopes.SINGLETON),
}
