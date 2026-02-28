import { observer } from 'mobx-react-lite';
import { createWidget } from '@core/di';
import { Circle } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import type { City } from '@services';
import { CityModelProvider, useCityModel } from './model';

interface CityWidgetProps {
  city: City;
}

/** Множитель радиуса для прозрачной клик-зоны */
const CITY_HIT_ZONE_MULTIPLIER = 1.4;

const CityView = observer(function CityView() {
  const {
    color,
    size,
    position,
    eulerRotation,
    select,
    setHovered,
    isRouteCreationActive,
    handlePointerDown,
    handlePointerUp,
    handlePointerOver,
    handlePointerOut,
  } = useCityModel();

  const hitZoneRadius = size * CITY_HIT_ZONE_MULTIPLIER;

  return (
    <group position={position} rotation={eulerRotation}>
      <Circle args={[size, 16]} raycast={() => null}>
        <meshBasicMaterial color={color} />
      </Circle>
      <Circle
        args={[hitZoneRadius, 16]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (!isRouteCreationActive) select();
        }}
        onPointerDown={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          handlePointerDown(e);
        }}
        onPointerUp={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          handlePointerUp(e);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered(true);
          if (isRouteCreationActive) handlePointerOver(e);
        }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
          setHovered(false);
          if (isRouteCreationActive) handlePointerOut(e);
        }}
      >
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </Circle>
    </group>
  );
});

export const CityWidget = createWidget<CityWidgetProps>(CityModelProvider, CityView);
