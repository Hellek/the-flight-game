import React from 'react';
import { observer } from 'mobx-react-lite';
import { Airport as AirportType } from '../types/types';
import { rootStore } from '../stores/RootStore';

interface RouteProps {
  departure: AirportType;
  arrival: AirportType;
}

export const Route: React.FC<RouteProps> = observer(({ departure, arrival }) => {
  const { selectedEntity } = rootStore.selectionStore;
  const isSelected = selectedEntity?.type === 'route' &&
    selectedEntity.data.departure.id === departure.id &&
    selectedEntity.data.arrival.id === arrival.id;

  const handleClick = () => {
    rootStore.selectionStore.selectRoute(departure, arrival);
  };

  const distance = Math.sqrt(
    Math.pow(arrival.position.x - departure.position.x, 2) +
    Math.pow(arrival.position.y - departure.position.y, 2)
  );

  const maxDistance = 1000;
  const normalizedDistance = Math.min(distance / maxDistance, 1);
  const arcHeight = Math.min(Math.pow(normalizedDistance, 2) * 300, 300);

  const midX = (departure.position.x + arrival.position.x) / 2;
  const midY = (departure.position.y + arrival.position.y) / 2 - arcHeight;

  const path = `M ${departure.position.x} ${departure.position.y} Q ${midX} ${midY} ${arrival.position.x} ${arrival.position.y}`;

  return (
    <g onClick={handleClick} className="cursor-pointer">
      <path
        d={path}
        fill="none"
        stroke={isSelected ? "#3b82f6" : "#94a3b8"}
        strokeWidth={isSelected ? 3 : 2}
        className="transition-all duration-200 hover:stroke-blue-500"
      />
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="hover:stroke-blue-200/20"
      />
    </g>
  );
});
