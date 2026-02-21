import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { useContainer } from './useContainer'

type Constructor<T> = new (...args: unknown[]) => T

/** Модель может реализовать init (при маунте), updateProps (при смене props) и destroy (при размонтировании) */
export interface InitableModel<P = unknown> {
  init?(props: P): void;
  updateProps?(props: P): void;
  destroy?(): void;
}

/** Вывод типа props провайдера из модели (из init/updateProps) */
export type InferProviderProps<M> = M extends InitableModel<infer P> ? P : Record<string, unknown>

/**
 * Создаёт провайдер и хук для ViewModel.
 * ViewModel резолвится из контейнера (transient). Инициализация — только через init модели (вызывается в useEffect после маунта).
 */
export function createProvider<M extends InitableModel<object>>(
  ModelClass: Constructor<M>,
): {
  Provider: React.FC<PropsWithChildren<InferProviderProps<M>>>;
  useModel: () => M;
} {
  type Props = InferProviderProps<M>
  const ModelContext = createContext<M | null>(null)

  const Provider = (props: PropsWithChildren<Props>) => {
    const container = useContainer()
    const { children, ...restProps } = props

    const [instance] = useState<M>(() => container.resolve(ModelClass) as M)

    useEffect(() => {
      if ('init' in instance && typeof instance.init === 'function') {
        instance.init(restProps as Props)
      }
      return () => {
        if ('destroy' in instance && typeof instance.destroy === 'function') {
          instance.destroy?.()
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- init once on mount, destroy on unmount
    }, [])

    useLayoutEffect(() => {
      if ('updateProps' in instance && typeof instance.updateProps === 'function') {
        instance.updateProps(restProps as Props)
      }
    }, [instance, restProps])

    return <ModelContext.Provider value={instance}>{children}</ModelContext.Provider>
  }

  const useModel = (): M => {
    const model = useContext(ModelContext)
    if (model === null) {
      throw new Error(
        `[DI] useModel() expects ${ModelClass.name}, but no provider found. Use ${ModelClass.name}Provider.`,
      )
    }
    return model
  }

  return { Provider, useModel }
}
