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

  // Создаем невидимую область для клика
  const clickAreaWidth = 28; // ширина кликабельной области
  const clickAreaPoints = [
    // Точки для создания параллелограмма вокруг линии
    { x: departure.position.x, y: departure.position.y - clickAreaWidth / 2 },
    { x: departure.position.x, y: departure.position.y + clickAreaWidth / 2 },
    { x: arrival.position.x, y: arrival.position.y + clickAreaWidth / 2 },
    { x: arrival.position.x, y: arrival.position.y - clickAreaWidth / 2 },
  ];

  return (
    <g
      onClick={() => onClick?.(departure, arrival)}
      className="cursor-pointer"
    >
      {/* Невидимая область для клика */}
      <path
        d={`M ${clickAreaPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`}
        fill="transparent"
        stroke="none"
      />

      {/* Видимая линия маршрута */}
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
