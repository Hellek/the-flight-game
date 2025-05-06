import React, { useRef, useMemo } from 'react';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { createGlobeTexture } from './GlobeTexture';
import { eurasiaCoordinates } from '../../data/terrains';

const globeMaterial = {
  waterColor: '#007beb',
  continentColor: '#ffffff',
};

export const GlobeSphere: React.FC = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const textureQuality = 2;

  const texture = useMemo(() => {
    return createGlobeTexture({
      continents: [eurasiaCoordinates],
      waterColor: globeMaterial.waterColor,
      continentColor: globeMaterial.continentColor,
      width: 2048 * textureQuality,
      height: 1024 * textureQuality
    });
  }, []);

  const degree10 = Math.PI / 18;

  return (
    <Sphere
      ref={sphereRef}
      args={[1, 64, 64]}
      rotation={[Math.PI / 4, Math.PI + degree10 * 3, 0]}
    >
      <meshPhongMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent={false}
      />
    </Sphere>
  );
};
