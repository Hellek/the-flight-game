import { useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { DoubleSide, type Mesh } from 'three';
import { createWidget } from '@core/di';
import { Sphere } from '@react-three/drei';
import { styleVars } from '@ui';
import { createGlobeTexture } from './components/GlobeSphere/createGlobeTexture';
import { eurasiaCoordinates } from './components/GlobeSphere/data';
import { GlobeSphereModelProvider, useGlobeSphereModel } from './model';

const GlobeSphereView = observer(function GlobeSphereView() {
  const sphereRef = useRef<Mesh>(null);
  const { handlePointerMove, handlePointerUp } = useGlobeSphereModel();
  const textureQuality = 2;

  /**
   * TODO может вынести в модель
   */
  const texture = useMemo(() => {
    return createGlobeTexture({
      continents: [eurasiaCoordinates],
      waterColor: styleVars.colorWater,
      continentColor: styleVars.colorContinent,
      width: 2048 * textureQuality,
      height: 1024 * textureQuality,
    });
  }, []);

  return (
    <group>
      <Sphere
        ref={sphereRef}
        args={[1, 64, 64]}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <meshPhongMaterial
          map={texture}
          side={DoubleSide}
          transparent={false}
        />
      </Sphere>
    </group>
  );
});

export const GlobeSphereWidget = createWidget(GlobeSphereModelProvider, GlobeSphereView);
