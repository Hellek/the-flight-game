import React from 'react';
import { Airport as AirportType } from '../types/types';

interface AirportProps {
  airport: AirportType;
  onClick?: (airport: AirportType) => void;
}

export const Airport: React.FC<AirportProps> = ({ airport, onClick }) => {
  const handleClick = () => {
    onClick?.(airport);
  };

  return (
    <g
      transform={`translate(${airport.position.x}, ${airport.position.y})`}
      className="cursor-pointer"
    >
      {/* Иконка аэропорта */}
      <circle
        r="8"
        fill="#2563eb"
        stroke="#1e40af"
        strokeWidth="2"
        className="hover:fill-blue-600 transition-colors"
        onClick={handleClick}
      />

      {/* Название аэропорта */}
      <g onClick={handleClick}>
        <rect
          x="8"
          y="-8"
          width="100"
          height="20"
          fill="transparent"
          className="hover:fill-blue-50 transition-colors rounded"
        />
        <text
          x="12"
          y="4"
          fontSize="12"
          fill="#1e293b"
          className="hover:fill-blue-800 transition-colors"
        >
          {airport.name}
        </text>
      </g>
    </g>
  );
};
