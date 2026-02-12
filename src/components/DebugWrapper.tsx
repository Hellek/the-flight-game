import React from 'react'

import { DEBUG } from '../constants'

interface DebugWrapperProps {
  children?: React.ReactNode
  size?: number
}

export const DebugWrapper: React.FC<DebugWrapperProps> = ({ children, size }) => {
  // Если отладка отключена, возвращаем только children
  if (!DEBUG.ENABLED || !DEBUG.SHOW_PLANES) {
    return <>{children}</>
  }

  // Ленивый импорт для отладочного компонента (только при включенной отладке)
  const DebugPlanes = React.lazy(() => import('./DebugPlanes').then(module => ({ default: module.DebugPlanes })))

  // Если отладка включена, добавляем отладочные элементы
  return (
    <>
      {children}
      <React.Suspense fallback={null}>
        <DebugPlanes size={size || DEBUG.PLANES_SIZE} />
      </React.Suspense>
    </>
  )
}
