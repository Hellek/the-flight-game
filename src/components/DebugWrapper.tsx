import { lazy, type ReactNode, Suspense } from 'react'
import { DEBUG } from '../constants'

interface DebugWrapperProps {
  children?: ReactNode
  size?: number
}

export const DebugWrapper = ({ children, size }: DebugWrapperProps) => {
  // Если отладка отключена, возвращаем только children
  if (!DEBUG.ENABLED || !DEBUG.SHOW_PLANES) {
    return <>{children}</>
  }

  // Ленивый импорт для отладочного компонента (только при включенной отладке)
  const DebugPlanes = lazy(() => import('./DebugPlanes').then(module => ({ default: module.DebugPlanes })))

  // Если отладка включена, добавляем отладочные элементы
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <DebugPlanes size={size || DEBUG.PLANES_SIZE} />
      </Suspense>
    </>
  )
}
