import React, { useRef } from 'react';
import { World as WorldType } from '../types/types';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface World3DProps {
  world: WorldType;
}

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={earthRef} args={[1, 64, 64]}>
      <meshStandardMaterial
        color="#1e40af"
        metalness={0.2}
        roughness={0.8}
      />
    </Sphere>
  );
};

export const World3D: React.FC<World3DProps> = ({ world }) => {
  return (
    <div className="w-full h-screen bg-slate-50">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Earth />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
