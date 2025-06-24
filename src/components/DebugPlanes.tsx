import React from 'react'
import * as THREE from 'three'

interface DebugPlanesProps {
  size?: number
}

export const DebugPlanes: React.FC<DebugPlanesProps> = ({ size = 0.1 }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Плоскость XZ (Y = 0) - зеленая */}
      <mesh
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      >
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color="#00ff00"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Плоскость XY (Z = 0) - синяя - повернута на 90 градусов вокруг оси X */}
      <mesh
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color="#0080ff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Плоскость YZ (X = 0) - красная - повернута на 90 градусов вокруг оси Y */}
      <mesh
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color="#ff0000"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
