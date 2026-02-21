import { type PropsWithChildren, useEffect, useState } from 'react'
import { rootContainer } from './container'
import { ContainerContext } from './diContext'
import { useContainer } from './useContainer'

export type DIProviderProps = PropsWithChildren<{
  instance?: import('./container').DIContainer;
}>

/** Провайдер контейнера — вешает контейнер в контекст */
export function DIProvider({ instance = rootContainer, children }: DIProviderProps) {
  return (
    <ContainerContext.Provider value={instance}>{children}</ContainerContext.Provider>
  )
}

export type ChildDIProviderProps = PropsWithChildren<{
  /** Имя дочернего контейнера (страница, слой, виджет) */
  name: string;
}>

/** Создаёт дочерний контейнер и предоставляет его поддереву; при размонтировании вызывает destroy */
export function ChildDIProvider({ name, children }: ChildDIProviderProps) {
  const parent = useContainer()
  const [child] = useState(() => parent.child(name))

  useEffect(
    () => () => {
      child.destroy()
    },
    [child],
  )

  return <DIProvider instance={child}>{children}</DIProvider>
}
