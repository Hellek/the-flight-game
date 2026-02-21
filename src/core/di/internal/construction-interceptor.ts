import type { Scope } from '../scope';
import { constructorScope } from '../symbols';
import type { Constructor } from '../types';
import { resolveTransformer } from './resolve-transformer';

/**
 * Оборачивает конструктор: перед созданием инстанса вызывается resolveTransformer.run(proxy, args).
 * Позволяет подменять/модифицировать аргументы (например, Props) при resolve.
 */
export function constructorWrapper<T extends Constructor<unknown>>(Target: T, scope: Scope): T {
  const proxy = new Proxy(Target, {
    construct(Ctor, args: ConstructorParameters<T>, newTarget) {
      resolveTransformer.run(proxy as T, args);
      return Reflect.construct(Ctor, args, newTarget);
    },
  })

  ;(proxy as unknown as Record<symbol, Scope>)[constructorScope] = scope;

  const paramTypes = Reflect.getMetadata?.('design:paramtypes', Target);
  if (paramTypes !== undefined && Reflect.defineMetadata) {
    Reflect.defineMetadata('design:paramtypes', paramTypes, proxy);
  }

  return proxy as T;
}
