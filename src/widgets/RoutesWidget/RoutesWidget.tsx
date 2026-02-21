import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { GLOBE_ROTATION, itemColor, itemColorHovered, itemColorSelected, ROUTE } from '@constants';
import { createWidget } from '@core/di';
import { Line } from '@react-three/drei';
import { RoutesModelProvider, useRoutesModel } from './model';

const RoutesView = observer(function RoutesView() {
  const { routes, getRoutePoints, selectedRoute, selectRoute } = useRoutesModel();
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  return (
    <group rotation={[GLOBE_ROTATION.X, GLOBE_ROTATION.Y, GLOBE_ROTATION.Z]}>
      {routes.map(route => {
        const points = getRoutePoints(route);
        const isSelected = selectedRoute?.id === route.id;
        const isHovered = hoveredRoute === route.id;

        return (
          <Line
            key={route.id}
            points={points}
            color={isSelected ? itemColorSelected : isHovered ? itemColorHovered : itemColor}
            lineWidth={ROUTE.WIDTH}
            onClick={e => {
              e.stopPropagation();
              selectRoute(route);
            }}
            onPointerOver={e => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
              setHoveredRoute(route.id);
            }}
            onPointerOut={e => {
              e.stopPropagation();
              document.body.style.cursor = 'auto';
              setHoveredRoute(null);
            }}
          />
        );
      })}
    </group>
  );
});

export const RoutesWidget = createWidget(RoutesModelProvider, RoutesView);
