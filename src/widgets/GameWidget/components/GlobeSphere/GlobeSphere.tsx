import { useMemo, useRef } from 'react';
import { DoubleSide, type Mesh } from 'three';
import { Sphere } from '@react-three/drei';
import { styleVars } from '@utils';
import { createGlobeTexture } from './createGlobeTexture';
import { eurasiaCoordinates } from './data';

export const GlobeSphere = () => {
  const sphereRef = useRef<Mesh>(null);
  const textureQuality = 2;

  const texture = useMemo(() => {
    return createGlobeTexture({
      continents: [eurasiaCoordinates],
      waterColor: styleVars.colorWater,
      continentColor: styleVars.colorContinent,
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
          side={DoubleSide}
          transparent={false}
        />
      </Sphere>
    </group>
  );
};
