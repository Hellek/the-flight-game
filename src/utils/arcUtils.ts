import { Position } from '../types/types';

/**
 * Рассчитывает контрольную точку для дуги маршрута
 */
export const calculateArcControlPoint = (
  start: Position,
  end: Position,
  maxDistance: number = 1000,
  maxHeight: number = 300
): Position => {
  const distance = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );

  const normalizedDistance = Math.min(distance / maxDistance, 1);
  const arcHeight = Math.min(Math.pow(normalizedDistance, 2) * maxHeight, maxHeight);

  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2 - arcHeight
  };
};

/**
 * Рассчитывает позицию на дуге для самолёта
 */
export function calculateArcPosition(
  start: Position,
  end: Position,
  progress: number
): Position {
  const controlPoint = calculateArcControlPoint(start, end);

  // Формула квадратичной кривой Безье
  const x = Math.pow(1 - progress, 2) * start.x +
    2 * (1 - progress) * progress * controlPoint.x +
    Math.pow(progress, 2) * end.x;

  const y = Math.pow(1 - progress, 2) * start.y +
    2 * (1 - progress) * progress * controlPoint.y +
    Math.pow(progress, 2) * end.y;

  return { x, y };
}
