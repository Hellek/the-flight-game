import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { continentColor, waterColor } from '@constants';
import { Sphere } from '@react-three/drei';
import { eurasiaCoordinates } from './data';
import { createGlobeTexture } from './utils/createGlobeTexture';

export const GlobeSphere = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const textureQuality = 2;

  const texture = useMemo(() => {
    return createGlobeTexture({
      continents: [eurasiaCoordinates],
      waterColor: waterColor,
      continentColor: continentColor,
      width: 2048 * textureQuality,
      height: 1024 * textureQuality,
    });
  }, []);

  const degree10 = Math.PI / 18;

  return (
    <group>
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
    </group>
  );
};
