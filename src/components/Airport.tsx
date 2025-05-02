import React from 'react';
import { Airport as AirportType } from '../types/types';

interface AirportProps {
  airport: AirportType;
  onClick?: (airport: AirportType) => void;
}

export const Airport: React.FC<AirportProps> = ({ airport, onClick }) => {
  return (
    <g
      transform={`translate(${airport.position.x}, ${airport.position.y})`}
      onClick={() => onClick?.(airport)}
      className="cursor-pointer"
    >
      {/* Иконка аэропорта */}
      <circle
        r="8"
        fill="#2563eb"
        stroke="#1e40af"
        strokeWidth="2"
        className="hover:fill-blue-600 transition-colors"
      />
      {/* Название аэропорта */}
      <text
        x="12"
        y="4"
        fontSize="12"
        fill="#1e293b"
        className="pointer-events-none"
      >
        {airport.name}
      </text>
    </g>
  );
};
