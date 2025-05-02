import React from 'react';
import { Airport as AirportType } from '../types/types';

interface RouteProps {
  departure: AirportType;
  arrival: AirportType;
  onClick?: (departure: AirportType, arrival: AirportType) => void;
}

export const Route: React.FC<RouteProps> = ({ departure, arrival, onClick }) => {
  const distance = Math.sqrt(
    Math.pow(arrival.position.x - departure.position.x, 2) +
    Math.pow(arrival.position.y - departure.position.y, 2)
  );

  return (
    <g
      onClick={() => onClick?.(departure, arrival)}
      className="cursor-pointer"
    >
      {/* Линия маршрута */}
      <line
        x1={departure.position.x}
        y1={departure.position.y}
        x2={arrival.position.x}
        y2={arrival.position.y}
        stroke="#94a3b8"
        strokeWidth="1"
        strokeDasharray="4"
        className="hover:stroke-blue-400 transition-colors"
      />

      {/* Расстояние */}
      <text
        x={(departure.position.x + arrival.position.x) / 2 + 20}
        y={(departure.position.y + arrival.position.y) / 2}
        fontSize="10"
        fill="#64748b"
        textAnchor="middle"
        className="pointer-events-none"
      >
        {Math.round(distance)} км
      </text>
    </g>
  );
};
