import React, { useRef } from 'react'
import * as THREE from 'three'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { DEBUG } from '../../constants'
import { DebugWrapper } from '../DebugWrapper'
import { AircraftViewerModel } from './aircraftsList'

// Компонент для вращения самолета
const RotatingAircraft: React.FC<{ model: AircraftViewerModel }> = ({ model: AircraftComponent }) => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(state => {
    if (groupRef.current) {
      // Медленное вращение вокруг оси Y
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <DebugWrapper size={DEBUG.VIEWER_PLANES_SIZE}>
        {React.createElement(AircraftComponent, {
          position: [0, 0, 0],
          color: '#4F46E5',
        })}
      </DebugWrapper>
    </group>
  )
}

interface AircraftViewerProps {
  className?: string
  model: AircraftViewerModel
}

export const AircraftViewer: React.FC<AircraftViewerProps> = ({ className = '', model }) => {
  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [15, 10, 5], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #1e293b, #334155)' }}
      >
        {/* Освещение */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Окружение */}
        <Environment preset="city" />

        {/* Самолет */}
        <RotatingAircraft model={model} />

        {/* Управление камерой */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={25}
        />
      </Canvas>
    </div>
  )
}
