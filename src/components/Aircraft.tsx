import React from 'react';
import { observer } from 'mobx-react-lite';
import { Plane } from 'lucide-react';
import { Aircraft as AircraftType, AircraftSize } from '../types/types';

interface AircraftProps {
  aircraft: AircraftType;
}

const getAircraftSize = (type: AircraftSize) => {
  switch (type) {
    case 1:
      return { width: 16, height: 16, strokeWidth: 1.5 };
    case 2:
      return { width: 20, height: 20, strokeWidth: 1.5 };
    case 3:
      return { width: 24, height: 24, strokeWidth: 2 };
    case 4:
      return { width: 28, height: 28, strokeWidth: 2 };
    case 5:
      return { width: 32, height: 32, strokeWidth: 2.5 };
  }
};

const getAircraftColor = (type: AircraftSize) => {
  switch (type) {
    case 1:
      return 'text-blue-300';
    case 2:
      return 'text-blue-400';
    case 3:
      return 'text-blue-500';
    case 4:
      return 'text-blue-600';
    case 5:
      return 'text-blue-700';
  }
};

export const Aircraft: React.FC<AircraftProps> = observer(({ aircraft }) => {
  const { width, height, strokeWidth } = getAircraftSize(aircraft.type);
  const colorClass = getAircraftColor(aircraft.type);

  return (
    <g
      transform={`translate(${aircraft.position.x - width / 2}, ${aircraft.position.y - height / 2})`}
      className={colorClass}
    >
      <Plane
        width={width}
        height={height}
        strokeWidth={strokeWidth}
        className="transform -rotate-45"
      />
    </g>
  );
});
