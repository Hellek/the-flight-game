import { useContext, useMemo } from 'react';
import { type Constructor, type DIContainer, rootContainer } from './container';
import { ContainerContext } from './diContext';

export function useContainer(): DIContainer {
  const c = useContext(ContainerContext);
  return c ?? rootContainer;
}

/** Резолв сущности из контейнера (по аналогии с vkcom: useContainer().resolve(Class)). */
export function useResolve<T>(token: Constructor<T>): T {
  const container = useContainer();
  return useMemo(() => container.resolve(token) as T, [container, token]);
}
