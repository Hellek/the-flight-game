import { createElement, useRef } from 'react';
import type { Group } from 'three';
import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import type { AircraftViewerModel } from '../model';

interface RotatingAircraftProps {
  model: AircraftViewerModel;
}

const RotatingAircraft = ({ model: AircraftComponent }: RotatingAircraftProps) => {
  const groupRef = useRef<Group>(null);

  useFrame(state => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {createElement(AircraftComponent, {
        position: [0, 0, 0],
        color: '#4F46E5',
      })}
    </group>
  );
};

interface AircraftViewerCanvasProps {
  model: AircraftViewerModel;
  className?: string;
}

export function AircraftViewerCanvas({
  model,
  className = '',
}: AircraftViewerCanvasProps) {
  return (
    <div className={`
      h-96 w-full overflow-hidden rounded-lg
      ${className}
    `}>
      <Canvas
        camera={{ position: [15, 10, 5], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #1e293b, #334155)' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        <Environment preset="city" />
        <RotatingAircraft model={model} />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={3}
          maxDistance={25}
        />
      </Canvas>
    </div>
  );
}
