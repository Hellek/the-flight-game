import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Airport as AirportType } from '../types/types';
import { rootStore } from '../stores/RootStore';

interface AirportProps {
  airport: AirportType;
}

export const Airport: React.FC<AirportProps> = observer(({ airport }) => {
  const { selectedEntity } = rootStore.selectionStore;
  const isSelected = selectedEntity?.type === 'airport' && selectedEntity.data.id === airport.id;
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    rootStore.selectionStore.selectAirport(airport);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getCircleStyle = () => {
    if (isSelected) return 'fill-blue-700';
    if (isHovered) return 'fill-blue-500';
    return 'fill-slate-400';
  };

  const getTextStyle = () => {
    if (isSelected) return 'fill-blue-700';
    if (isHovered) return 'fill-blue-500';
    return 'fill-slate-600';
  };

  return (
    <g
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer"
    >
      <circle
        cx={airport.position.x}
        cy={airport.position.y}
        r={6}
        className={`${getCircleStyle()}`}
      />
      <text
        x={airport.position.x + 10}
        y={airport.position.y + 5}
        className={`text-sm font-medium ${getTextStyle()}`}
      >
        {airport.city}
      </text>
      <text
        x={airport.position.x + 10}
        y={airport.position.y + 20}
        className={`text-xs ${getTextStyle()}`}
      >
        {airport.name}
      </text>
    </g>
  );
});
