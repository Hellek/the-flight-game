import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { type Euler, Vector3 } from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import type { Aircraft } from '@services';
import { styleVars } from '@ui';
import { Airplane } from './Airplane';

/**
 * Параметры воздушного судна (пока хардкод)
 */
const AIRCRAFT = {
  SIZE: 0.0025,
  /** Радиус прозрачной клик-зоны в мировых единицах */
  HIT_ZONE_RADIUS: 0.012,
};

interface AircraftViewProps {
  aircraft: Aircraft;
  getPosition: (aircraft: Aircraft) => Vector3;
  getRotation: (aircraft: Aircraft) => Euler;
  isSelected: boolean;
  onSelect: (aircraft: Aircraft) => void;
}

export const AircraftView = observer(function AircraftView({
  aircraft,
  getPosition,
  getRotation,
  isSelected,
  onSelect,
}: AircraftViewProps) {
  const [isHovered, setIsHovered] = useState(false);

  const currentPoint = getPosition(aircraft);
  const rotation = getRotation(aircraft);

  const color = isSelected
    ? styleVars.colorItemSelected
    : isHovered ? styleVars.colorItemHovered : styleVars.colorAircraft;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(aircraft);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setIsHovered(true);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    setIsHovered(false);
  };

  return (
    <group position={currentPoint} rotation={rotation}>
      <group raycast={() => null}>
        <Airplane
          position={new Vector3(0, 0, 0)}
          scale={AIRCRAFT.SIZE}
          color={color}
        />
      </group>
      <mesh
        position={[0, 0, 0]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[AIRCRAFT.HIT_ZONE_RADIUS, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
});
