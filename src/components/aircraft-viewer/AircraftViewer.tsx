import { createElement, useRef } from 'react'
import type * as THREE from 'three'
import type { AircraftViewerModel } from '@components/aircraft-viewer/aircraftsList'
import { DebugWrapper } from '@components/DebugWrapper'
import { DEBUG } from '@constants'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'

// Компонент для вращения самолета
const RotatingAircraft = ({ model: AircraftComponent }: { model: AircraftViewerModel }) => {
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
        {createElement(AircraftComponent, {
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

export const AircraftViewer = ({ className = '', model }: AircraftViewerProps) => {
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
