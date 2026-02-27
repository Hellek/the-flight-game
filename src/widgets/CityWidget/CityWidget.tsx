import { observer } from 'mobx-react-lite';
import { createWidget } from '@core/di';
import { Circle } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import type { City } from '@services';
import { CityModelProvider, useCityModel } from './model';

interface CityWidgetProps {
  city: City;
}

const CityView = observer(function CityView() {
  const {
    color,
    size,
    position,
    eulerRotation,
    select,
    setHovered,
  } = useCityModel();

  return (
    <Circle
      args={[size, 16]}
      position={position}
      rotation={eulerRotation}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        select();
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHovered(true);
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
        setHovered(false);
      }}
    >
      <meshBasicMaterial color={color} />
    </Circle>
  );
});

export const CityWidget = createWidget<CityWidgetProps>(CityModelProvider, CityView);
