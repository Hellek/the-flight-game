import React from 'react';
import { observer } from 'mobx-react-lite';
import { Route as RouteType } from '../types/types';
import { rootStore } from '../stores/RootStore';

export const Route: React.FC<{ route: RouteType }> = observer(({ route }) => {
  const { departureAirport, arrivalAirport } = route;
  const { selectedEntity } = rootStore.selectionStore;
  const isSelected = selectedEntity?.type === 'route' && selectedEntity.data.id === route.id;

  const handleClick = () => {
    rootStore.selectionStore.selectRoute(route);
  };

  const distance = Math.sqrt(
    Math.pow(arrivalAirport.position.x - departureAirport.position.x, 2) +
    Math.pow(arrivalAirport.position.y - departureAirport.position.y, 2)
  );

  const maxDistance = 1000;
  const normalizedDistance = Math.min(distance / maxDistance, 1);
  const arcHeight = Math.min(Math.pow(normalizedDistance, 2) * 300, 300);

  const midX = (departureAirport.position.x + arrivalAirport.position.x) / 2;
  const midY = (departureAirport.position.y + arrivalAirport.position.y) / 2 - arcHeight;

  const path = `M ${departureAirport.position.x} ${departureAirport.position.y} Q ${midX} ${midY} ${arrivalAirport.position.x} ${arrivalAirport.position.y}`;

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
