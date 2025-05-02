import React from 'react';
import { Airport as AirportType } from '../types/types';

interface AirportProps {
  airport: AirportType;
  onClick?: (airport: AirportType) => void;
  isSelected?: boolean;
}

export const Airport: React.FC<AirportProps> = ({
  airport,
  onClick,
  isSelected = false
}) => {
  const handleClick = () => {
    onClick?.(airport);
  };

  const getAirportColor = () => {
    if (isSelected) return "#1d4ed8"; // Более темный синий для выбранного
    return "#2563eb"; // Обычный синий
  };

  const getAirportStroke = () => {
    if (isSelected) return "#1e3a8a"; // Более темный синий для обводки выбранного
    return "#1e40af"; // Обычный синий для обводки
  };

  return (
    <g
      transform={`translate(${airport.position.x}, ${airport.position.y})`}
      className="cursor-pointer"
    >
      {/* Иконка аэропорта */}
      <circle
        r="8"
        fill={getAirportColor()}
        stroke={getAirportStroke()}
        strokeWidth={isSelected ? "3" : "2"}
        className="transition-all duration-200 hover:fill-blue-600"
        onClick={handleClick}
      />

      {/* Название аэропорта */}
      <g
        onClick={handleClick}
        className="group"
      >
        <text
          x="12"
          y="4"
          fontSize="12"
          fill={isSelected ? "#1e3a8a" : "#1e293b"}
          className="transition-colors duration-200 group-hover:fill-blue-800"
        >
          {airport.name}
        </text>
      </g>
    </g>
  );
};
