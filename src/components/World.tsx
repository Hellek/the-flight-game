import React from 'react'
import * as THREE from 'three'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { GlobeSphere } from './GlobeSphere'
import { InfoPanel } from './InfoPanel'

export const World: React.FC = () => {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 45,
        }}
      >
        <ambientLight intensity={3} />
        <GlobeSphere />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={1.1}
          maxDistance={3}
          rotateSpeed={0.5}
          target={new THREE.Vector3(0, 0, 0)}
          makeDefault
        />
      </Canvas>
      <InfoPanel />
    </div>
  )
}
