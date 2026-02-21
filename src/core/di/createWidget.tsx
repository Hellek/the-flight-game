import type { ComponentType, FC, PropsWithChildren } from 'react'

/**
 * Склеивает провайдер модели и презентационный компонент в виджет.
 * View — dummy: не знает про контейнер, только про useModel().
 */
export function createWidget<Props extends object>(
  Provider: FC<PropsWithChildren<Props>>,
  View: ComponentType<PropsWithChildren<Props>>,
): FC<Props> {
  function Widget(props: Props) {
    return (
      <Provider {...props}>
        <View {...props} />
      </Provider>
    )
  }

  Widget.displayName = `Widget(${View.displayName ?? View.name ?? 'View'})`
  return Widget
}
