import {
  injectable,
  Lifecycle,
  scoped,
  singleton,
} from 'tsyringe';
import { constructorWrapper } from './internal/construction-interceptor';
import { type Scope, scopes } from './scope';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- DI: цель декоратора — класс с произвольными параметрами конструктора
type Constructor = new (...args: any[]) => unknown;

function mapToTsyringe(scope: Scope): <T extends Constructor>(target: T) => T {
  const tsyringeDecorator =
    scope === scopes.TRANSIENT
      ? injectable()
      : scope === scopes.CONTAINER
        ? scoped(Lifecycle.ContainerScoped)
        : scope === scopes.SINGLETON
          ? singleton()
          : injectable();

  return <T extends Constructor>(target: T) => {
    const wrapped = constructorWrapper(target as Constructor & { new (...args: unknown[]): unknown }, scope);
    tsyringeDecorator(wrapped);
    return wrapped as T;
  };
}

/**
 * Декораторы scope: явно задают время жизни сущности в контейнере.
 * ViewModel виджетов — @scope.transient(); сервисы и плагины — @scope.container() или @scope.singleton().
 */
export const scope = {
  /** Новый инстанс при каждом resolve (для ViewModel виджетов) */
  transient: () => mapToTsyringe(scopes.TRANSIENT),
  /** Один инстанс на контейнер (для сервисов) */
  container: () => mapToTsyringe(scopes.CONTAINER),
  /** Один инстанс на всё приложение */
  singleton: () => mapToTsyringe(scopes.SINGLETON),
};
