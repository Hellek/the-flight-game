import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Props } from './Props';
import { scopes } from './scope';
import { constructorScope, destroy, init, propsAttribute } from './symbols';
import { useContainer } from './useContainer';

// Регистрируем Props в контейнере при первом импорте
void Props;

/** конструктор с любыми параметрами (резолв через контейнер). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- DI: класс с инжекцией в конструктор
type Constructor<T> = new (...args: any[]) => T;

/** Жизненный цикл модели: [init] и [destroy] по токенам (вызывает только провайдер). */
export interface InitableModel<P = unknown> {
  [init]?(props: P): void
  [destroy]?(): void
  updateProps?(props: P): void
}

/** Вывод типа props провайдера из сигнатуры [init](props) модели. */
export type InferProviderProps<M> = M extends { [init]?(props: infer P): unknown } ? P : Record<string, unknown>;

export type CreateProviderConfig = {
  /** Проверять, что модель задекорирована как scope.transient() (по умолчанию true). */
  onlyTransient?: boolean
  /** Вызывать [init] в useEffect (true) или в useLayoutEffect (false). По умолчанию true. */
  initInEffect?: boolean
};

/**
 * Создаёт провайдер и хук для ViewModel.
 * ViewModel резолвится из контейнера (transient).
 * Опционально модель может реализовать init (при маунте), updateProps (при смене props), destroy (при размонтировании) — проверка только в runtime, implements не требуется.
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
  const ModelContext = createContext<M | null>(null);

  const EffectHook = initInEffect ? useEffect : useLayoutEffect;

  const Provider = (props: PropsWithChildren<ModelProps>) => {
    const container = useContainer();
    const { children, ...restProps } = props;

    const [instance] = useState<M>(() => {
      return container.resolveWithTransforms(ModelClass, (args: unknown[]) => {
        const pa = propsAttribute;

        const propsInstance = args.find((arg: unknown) => {
          if (arg === null || typeof arg !== 'object') return false;
          const ctor = (arg as { constructor?: unknown }).constructor;
          return typeof ctor === 'function' && (ctor as unknown as Record<symbol, unknown>)[pa] === true;
        }) as { set: (p: ModelProps) => void } | undefined;

        if (propsInstance?.set) {
          propsInstance.set(restProps as ModelProps);
        }
      }) as M;
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

    useLayoutEffect(() => {
      if ('updateProps' in instance && typeof instance.updateProps === 'function') {
        instance.updateProps(restProps as ModelProps);
      }
    }, [instance, restProps]);

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
