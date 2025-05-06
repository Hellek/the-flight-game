import React from 'react';
import { Sphere } from '@react-three/drei';
import { airportsRussia } from '../../data/airports';

const citySize = 0.004;
const cityColor = '#ff4444';
const degree10 = Math.PI / 18;

export const GlobeCities: React.FC = () => {
  return (
    <group rotation={[Math.PI / 4, Math.PI + degree10 * 3, 0]}>
      {airportsRussia.map((city, index) => {
        // Преобразуем географические координаты в 3D координаты на сфере
        const phi = (90 - city.latitude) * (Math.PI / 180);
        const theta = (city.longitude + 180) * (Math.PI / 180);

        const x = -Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);

        return (
          <Sphere
            key={index}
            args={[citySize, 16, 16]}
            position={[x, y, z]}
          >
            <meshBasicMaterial color={cityColor} />
          </Sphere>
        );
      })}
    </group>
  );
};
