import React from 'react';
import { observer } from 'mobx-react-lite';
import { computed } from 'mobx';
import { Route as RouteType } from '../types/types';
import { rootStore } from '../stores/RootStore';
import { calculateArcControlPoint } from '../utils/arcUtils';
import { cn } from '../utils/cn';

// Основной компонент маршрута
export const Route: React.FC<{ route: RouteType }> = observer(({ route }) => {
  const isSelected = computed(() => {
    const { selectedEntity } = rootStore.selectionStore;
    return selectedEntity?.type === 'route' && selectedEntity.data.id === route.id;
  }).get();

  const controlPoint = calculateArcControlPoint(
    route.departureAirport.position,
    route.arrivalAirport.position
  );

  const path = `M ${route.departureAirport.position.x} ${route.departureAirport.position.y} Q ${controlPoint.x} ${controlPoint.y} ${route.arrivalAirport.position.x} ${route.arrivalAirport.position.y}`;

  return (
    <g
      onClick={() => rootStore.selectionStore.selectRoute(route)}
      className="cursor-pointer"
    >
      <path
        d={path}
        fill="none"
        stroke={isSelected ? "#3b82f6" : "#94a3b8"}
        strokeWidth={1}
        className={cn('transition-all duration-200 hover:stroke-blue-500', isSelected ? 'opacity-100' : 'opacity-30')}
      />
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        className="hover:stroke-blue-200/15"
      />
    </g>
  );
});
