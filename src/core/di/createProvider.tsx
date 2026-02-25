import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Props } from './Props';
import { scopes } from './scope';
import {
  constructorScope,
  destroy,
  init,
  propsAttribute,
} from './symbols';
import { useContainer } from './useContainer';

// Регистрируем Props в контейнере при первом импорте
void Props;

/** Shallow-сравнение по ссылкам полей: эффект срабатывает при реальной смене данных. */
function shallowCompare<T extends Record<string, unknown>>(prev: T, next: T): boolean {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  if (prevKeys.length !== nextKeys.length) return false;
  return prevKeys.every(k => Object.hasOwn(next, k) && Object.is(prev[k], next[k]));
}

/** Возвращает [memoizedProps]: ссылка меняется только при shallow-смене props. Используется как deps эффекта. Без чтения ref в рендере. */
function useMemoizeProps<T extends Record<string, unknown>>(
  props: T,
  equalityCheck: (prev: T, next: T) => boolean = shallowCompare,
): [T] {
  const [memoized, setMemoized] = useState<T>(() => props);

  if (!equalityCheck(memoized, props)) {
    setMemoized(props);
    return [props];
  }
  return [memoized];
}

/** конструктор с любыми параметрами (резолв через контейнер). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- DI: класс с инжекцией в конструктор
type Constructor<T> = new (...args: any[]) => T;

/** Жизненный цикл модели: [init] и [destroy] по токенам (вызывает только провайдер). */
export interface InitableModel<P = unknown> {
  [init]?(props: P): void
  [destroy]?(): void
  updateProps?(props: P): void
}

/** Вывод типа props провайдера из аргумента Props<P> в конструкторе модели. */
export type InferProviderPropsFromConstructor<M> =
  M extends new (...args: unknown[]) => unknown
    ? Extract<ConstructorParameters<M>[number], Props<object>> extends Props<infer P>
      ? P
      : never
    : never;

/** Вывод типа props провайдера: из Props<P> в конструкторе или из [init](props). */
export type InferProviderProps<M> =
  InferProviderPropsFromConstructor<M> extends never
    ? (M extends { [init]?(props: infer P): unknown } ? P : Record<string, unknown>)
    : InferProviderPropsFromConstructor<M>;

export type CreateProviderConfig = {
  /** Проверять, что модель задекорирована как scope.transient() (по умолчанию true). */
  onlyTransient?: boolean
  /** Вызывать [init] в useEffect (true) или в useLayoutEffect (false). По умолчанию true. */
  initInEffect?: boolean
};

/**
 * Создаёт провайдер и хук для ViewModel.
 * ViewModel резолвится из контейнера (transient).
 * Если модель в конструкторе принимает Props<P>, провайдер при создании и при смене props вызывает set(restProps)
 * на том же инстансе Props, что у текущей модели (привязка к instance сохраняет корректное обновление при Strict Mode).
 * Опционально модель может реализовать [init] (при маунте), updateProps (при смене props), [destroy] (при размонтировании) — проверка только в runtime, implements не требуется.
 */
export function createProvider<M extends object>(
  ModelClass: Constructor<M>,
  config?: CreateProviderConfig,
): {
  Provider: React.FC<PropsWithChildren<InferProviderProps<M>>>;
  useModel: () => M;
} {
  const { onlyTransient = true, initInEffect = true } = config ?? {};

  if (onlyTransient) {
    const scope = (ModelClass as unknown as Record<symbol, string>)[constructorScope];
    if (scope !== scopes.TRANSIENT) {
      throw new Error(
        `[DI] createProvider: ViewModel must be @scope.transient(), got scope "${scope ?? 'unknown'}". Use only TRANSIENT for view models.`,
      );
    }
  }

  type ModelProps = InferProviderProps<M>;
  type PropsSet = { set: (p: ModelProps) => void };
  const propsStore = new WeakMap<object, PropsSet>();
  const ModelContext = createContext<M | null>(null);

  const EffectHook = initInEffect ? useEffect : useLayoutEffect;

  const Provider = (props: PropsWithChildren<ModelProps>) => {
    const container = useContainer();
    const { children, ...restProps } = props;
    const propsRef = useRef<PropsSet | null>(null);
    const restPropsRef = useRef<ModelProps>(restProps as ModelProps);
    restPropsRef.current = restProps as ModelProps;
    const memoizedProps = useMemoizeProps(restProps as Record<string, unknown>) as [ModelProps];

    const [instance] = useState<M>(() => {
      const result = container.resolveWithTransforms(ModelClass, (args: unknown[]) => {
        const pa = propsAttribute;

        const propsInstance = args.find((arg: unknown) => {
          if (arg === null || typeof arg !== 'object') return false;
          const ctor = (arg as { constructor?: unknown }).constructor;
          return typeof ctor === 'function' && (ctor as unknown as Record<symbol, unknown>)[pa] === true;
        }) as PropsSet | undefined;

        if (propsInstance?.set) {
          propsInstance.set(restProps as ModelProps);
          propsRef.current = propsInstance;
        }
      }) as M;

      if (propsRef.current) {
        propsStore.set(result, propsRef.current);
      }

      return result;
    });

    EffectHook(() => {
      const initFn = (instance as Partial<InitableModel<ModelProps>>)[init];
      if (typeof initFn === 'function') {
        initFn.call(instance, restProps as ModelProps);
      }
      return () => {
        container.destroyInstance(instance as Parameters<typeof container.destroyInstance>[0]);
      };
    }, []);

    const memoizedPropsStable = memoizedProps[0];
    useLayoutEffect(() => {
      const currentProps = restPropsRef.current;
      const attached = propsStore.get(instance);

      attached?.set(currentProps);
      if ('updateProps' in instance && typeof instance.updateProps === 'function') {
        instance.updateProps(currentProps);
      }
    }, [instance, memoizedPropsStable]);

    return <ModelContext.Provider value={instance}>{children}</ModelContext.Provider>;
  };

  const useModel = (): M => {
    const model = useContext(ModelContext);
    if (model === null) {
      throw new Error(
        `[DI] useModel() expects ${ModelClass.name}, but no provider found. Use ${ModelClass.name}Provider.`,
      );
    }
    if (!(model instanceof ModelClass)) {
      throw new Error(
        `[DI] useModel() expects ${ModelClass.name} in its provider tree, but got a different model. Ensure this component is rendered inside ${ModelClass.name}Provider.`,
      );
    }
    return model;
  };

  return { Provider, useModel };
}
