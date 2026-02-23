import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { createWidget } from '@core/di';
import { Line } from '@react-three/drei';
import { styleVars } from '@ui';
import { RoutesModelProvider, useRoutesModel } from './model';

/**
 * Параметры маршрута (пока хардкод)
 */
const ROUTE = { WIDTH: 5 };

const RoutesView = observer(function RoutesView() {
  const { routes, getRoutePoints, selectedRoute, selectRoute, globeInitialRotation } = useRoutesModel();
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  return (
    <group rotation={globeInitialRotation}>
      {routes.map(route => {
        const points = getRoutePoints(route);
        const isSelected = selectedRoute?.id === route.id;
        const isHovered = hoveredRoute === route.id;

        return (
          <Line
            key={route.id}
            points={points}
            color={isSelected
              ? styleVars.colorItemSelected
              : isHovered ? styleVars.colorItemHovered : styleVars.colorItem}
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
