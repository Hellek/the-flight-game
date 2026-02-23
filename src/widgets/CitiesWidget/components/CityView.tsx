import { useCallback, useState } from 'react';
import {
  Euler,
  Matrix4,
  Quaternion,
  Vector3,
} from 'three';
import { Circle } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import type { City } from '@services';
import { styleVars } from '@utils';

/**
 * Параметры городов (пока хардкод)
 */
const CITY = { SIZE: 0.005 };

interface CityViewProps {
  city: City
  onSelect: (city: City) => void
  selectedCity: City | null
}

export function CityView({ city, onSelect, selectedCity }: CityViewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedCity?.iata === city.iata;

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect(city);
    },
    [city, onSelect],
  );

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

  const color = isSelected ? styleVars.colorItemSelected : isHovered ? styleVars.colorItemHovered : styleVars.colorItem;
  const position = [city.position.x, city.position.y, city.position.z] as [number, number, number];

  // Вычисляем нормаль поверхности в точке города
  const normal = city.position.clone().normalize();

  // Вычисляем поворот для ориентации круга перпендикулярно нормали
  const up = new Vector3(0, 1, 0);
  const rotationMatrix = new Matrix4();
  rotationMatrix.lookAt(new Vector3(0, 0, 0), normal, up);
  const quaternion = new Quaternion();
  quaternion.setFromRotationMatrix(rotationMatrix);
  const euler = new Euler();
  euler.setFromQuaternion(quaternion);

  // Разворачиваем на 180 градусов, чтобы лицевая сторона смотрела от центра
  euler.y += Math.PI;

  return (
    <Circle
      args={[CITY.SIZE, 16]}
      position={position}
      rotation={[euler.x, euler.y, euler.z]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <meshBasicMaterial color={color} />
    </Circle>
  );
}
