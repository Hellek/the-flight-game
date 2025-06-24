import React from 'react'

import { OrbitControls } from '@react-three/drei'

// https://threejs.org/docs/#examples/en/controls/OrbitControls
export const GameControls: React.FC = () => {
  return (
    <OrbitControls
      enableDamping={true} // инерция вращения
      dampingFactor={0.05} // коэффициент инерции вращения
      minDistance={1.16}
      enablePan={false} // запрещаем смещать, только вращать
      maxDistance={1.8}
      rotateSpeed={0.2}
      target={[0, 0, 0]} // камера всегда смотрит на центр планеты
      makeDefault
    />
  )
}
