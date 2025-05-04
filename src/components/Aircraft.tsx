import React from 'react';
import { observer } from 'mobx-react-lite';
import { Plane } from 'lucide-react';
import { Aircraft as AircraftType, AircraftSize } from '../types/types';
import { calculateArcPosition } from '../utils/arcUtils';

interface AircraftProps {
  aircraft: AircraftType;
}

const getAircraftSize = (type: AircraftSize) => {
  switch (type) {
    case 1:
      return { width: 16, height: 16 };
    case 2:
      return { width: 20, height: 20 };
    case 3:
      return { width: 24, height: 24 };
    case 4:
      return { width: 28, height: 28 };
    case 5:
      return { width: 32, height: 32 };
  }
};

const getAircraftColor = (type: AircraftSize) => {
  switch (type) {
    case 1:
      return 'text-blue-400';
    case 2:
      return 'text-blue-500';
    case 3:
      return 'text-blue-600';
    case 4:
      return 'text-blue-700';
    case 5:
      return 'text-blue-800';
  }
};

export const Aircraft: React.FC<AircraftProps> = observer(({ aircraft }) => {
  const { width, height } = getAircraftSize(aircraft.type);
  const colorClass = getAircraftColor(aircraft.type);

  // Рассчитываем угол поворота самолёта
  const calculateRotation = () => {
    const { departureAirport, arrivalAirport } = aircraft.route;

    // Рассчитываем текущую позицию
    const currentPos = aircraft.position;

    // Рассчитываем следующую позицию (немного впереди текущей)
    const nextProgress = aircraft.progress + (aircraft.direction === 'forward' ? 0.01 : -0.01);
    const nextPos = calculateArcPosition(
      departureAirport.position,
      arrivalAirport.position,
      nextProgress
    );

    // Рассчитываем угол между текущей и следующей позицией
    const dx = nextPos.x - currentPos.x;
    const dy = nextPos.y - currentPos.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Корректируем угол с учётом начальной ориентации иконки (+45 градусов)
    return angle + 45;
  };

  const rotation = calculateRotation();

  return (
    <g
      transform={`translate(${aircraft.position.x}, ${aircraft.position.y}) rotate(${rotation})`}
      className={colorClass}
    >
      <Plane
        width={width}
        height={height}
        fill='currentColor'
        strokeWidth={1}
        x={-width / 2}
        y={-height / 2}
      />
    </g>
  );
});
