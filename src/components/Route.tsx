import React, { useState } from 'react';
import { Airport as AirportType } from '../types/types';

interface RouteProps {
  departure: AirportType;
  arrival: AirportType;
  onClick?: (departure: AirportType, arrival: AirportType) => void;
  isSelected?: boolean;
}

export const Route: React.FC<RouteProps> = ({
  departure,
  arrival,
  onClick,
  isSelected = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
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

  const getStrokeColor = () => {
    if (isSelected) return "#3b82f6";
    if (isHovered) return "#60a5fa";
    return "#94a3b8";
  };

  return (
    <g
      onClick={() => onClick?.(departure, arrival)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        stroke={getStrokeColor()}
        strokeWidth={isSelected ? "2" : "1"}
        strokeDasharray="4"
        className="transition-all duration-200"
      />
    </g>
  );
};
