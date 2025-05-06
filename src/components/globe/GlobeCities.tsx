import React, { useState } from 'react';
import { Sphere } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { airportsRussia } from '../../data/airports';
import { rootStore } from '../../stores/RootStore';
import { Airport } from '../../types/types';
import colors from 'tailwindcss/colors';

const citySize = 0.005;
const degree10 = Math.PI / 18;

export const defaultCityColor = colors.slate[400];
export const selectedCityColor = colors.blue[700];
export const hoveredCityColor = colors.blue[500];

export const GlobeCities: React.FC = observer(() => {
  const { selectedEntity } = rootStore.selectionStore;
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <group rotation={[Math.PI / 4, Math.PI + degree10 * 3, 0]}>
      {airportsRussia.map((city, index) => {
        // Преобразуем географические координаты в 3D координаты на сфере
        const phi = (90 - city.latitude) * (Math.PI / 180);
        const theta = (city.longitude + 180) * (Math.PI / 180);

        const x = -Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);

        const isSelected = selectedEntity?.type === 'airport' &&
          selectedEntity.data.iata === city.iata;
        const isHovered = hoveredCity === city.iata;

        return (
          <Sphere
            key={index}
            args={[citySize, 16, 16]}
            position={[x, y, z]}
            onClick={(e) => {
              e.stopPropagation();
              const airport: Airport = {
                id: city.iata,
                name: city.city,
                city: city.city,
                iata: city.iata,
                position: { x: city.longitude, y: city.latitude }
              };
              rootStore.selectionStore.selectAirport(airport);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
              setHoveredCity(city.iata);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'auto';
              setHoveredCity(null);
            }}
          >
            <meshBasicMaterial
              color={isSelected ? selectedCityColor : isHovered ? hoveredCityColor : defaultCityColor}
            />
          </Sphere>
        );
      })}
    </group>
  );
});
