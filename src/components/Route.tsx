import React from 'react';
import { Airport as AirportType } from '../types/types';

interface RouteProps {
  departure: AirportType;
  arrival: AirportType;
  onClick?: (departure: AirportType, arrival: AirportType) => void;
}

export const Route: React.FC<RouteProps> = ({ departure, arrival, onClick }) => {
  const curveLevel = 1.5;
  const distance = Math.sqrt(
    Math.pow(arrival.position.x - departure.position.x, 2) +
    Math.pow(arrival.position.y - departure.position.y, 2)
  );

  // Вычисляем контрольную точку для дуги
  const maxDistance = 1000; // максимальное расстояние для нормализации
  const normalizedDistance = Math.min(distance / maxDistance, 1);
  const maxArcHeight = 300; // максимальная высота дуги
  const arcHeight = Math.min(Math.pow(normalizedDistance, 2) * maxArcHeight * curveLevel, maxArcHeight * curveLevel);

  // Вычисляем середину между аэропортами
  const midX = (departure.position.x + arrival.position.x) / 2;
  const midY = (departure.position.y + arrival.position.y) / 2;

  // Вычисляем перпендикулярный вектор для создания симметричной кривой
  const dx = arrival.position.x - departure.position.x;
  const dy = arrival.position.y - departure.position.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const perpX = -dy / length;
  const perpY = dx / length;

  // Создаем контрольную точку, смещенную перпендикулярно от середины
  const controlX = midX + perpX * arcHeight;
  const controlY = midY + perpY * arcHeight;

  // Создаем путь для дуги
  const arcPath = `M ${departure.position.x} ${departure.position.y}
                   Q ${controlX} ${controlY}
                     ${arrival.position.x} ${arrival.position.y}`;

  // Создаем кликабельную область вокруг дуги
  const clickAreaWidth = 28;
  const clickAreaPath = `M ${departure.position.x} ${departure.position.y - clickAreaWidth / 2}
                        Q ${controlX} ${controlY - clickAreaWidth / 2}
                          ${arrival.position.x} ${arrival.position.y - clickAreaWidth / 2}
                        L ${arrival.position.x} ${arrival.position.y + clickAreaWidth / 2}
                        Q ${controlX} ${controlY + clickAreaWidth / 2}
                          ${departure.position.x} ${departure.position.y + clickAreaWidth / 2}
                        Z`;

  return (
    <g
      onClick={() => onClick?.(departure, arrival)}
      className="cursor-pointer"
    >
      {/* Невидимая область для клика */}
      <path
        d={clickAreaPath}
        fill="transparent"
        stroke="none"
      />

      {/* Видимая дуга маршрута */}
      <path
        d={arcPath}
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1"
        strokeDasharray="4"
        className="hover:stroke-blue-400 transition-colors"
      />
    </g>
  );
};
