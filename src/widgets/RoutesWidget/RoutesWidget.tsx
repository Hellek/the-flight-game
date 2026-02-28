import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { CatmullRomCurve3, TubeGeometry, type Vector3 } from 'three';
import { createWidget } from '@core/di';
import { Line } from '@react-three/drei';
import { styleVars } from '@ui';
import { RoutesModelProvider, useRoutesModel } from './model';

/**
 * Параметры маршрута
 */
const ROUTE = {
  WIDTH: 5,
  /** Радиус прозрачной клик-зоны в мировых единицах */
  HIT_ZONE_RADIUS: 0.004,
};

interface RouteHitZoneProps {
  points: Vector3[];
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}

function RouteHitZone({ points, onSelect, onHover }: RouteHitZoneProps) {
  const geometry = useMemo(() => {
    if (points.length < 2) return null;
    const curve = new CatmullRomCurve3(points);
    return new TubeGeometry(
      curve,
      Math.max(points.length * 2, 16),
      ROUTE.HIT_ZONE_RADIUS,
      6,
      false,
    );
  }, [points]);

  useEffect(
    () => () => geometry?.dispose(),
    [geometry],
  );

  if (!geometry) return null;

  return (
    <mesh
      geometry={geometry}
      onClick={e => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={e => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHover(true);
      }}
      onPointerOut={e => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
        onHover(false);
      }}
    >
      <meshBasicMaterial
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

const RoutesView = observer(function RoutesView() {
  const {
    routes,
    getRoutePoints,
    selectedRoute,
    selectRoute,
    routesVisible,
    hoveredRouteId,
    setHoveredRoute,
  } = useRoutesModel();

  if (!routesVisible) return null;

  return (
    <>
      {routes.map(route => {
        const points = getRoutePoints(route);
        const isSelected = selectedRoute?.id === route.id;
        const isHovered = hoveredRouteId === route.id;

        return (
          <group key={route.id}>
            <Line
              points={points}
              color={isSelected
                ? styleVars.colorItemSelected
                : isHovered ? styleVars.colorItemHovered : styleVars.colorItem}
              lineWidth={ROUTE.WIDTH}
              raycast={() => null}
            />
            <RouteHitZone
              points={points}
              onSelect={() => selectRoute(route)}
              onHover={hovered => setHoveredRoute(hovered ? route.id : null)}
            />
          </group>
        );
      })}
    </>
  );
});

export const RoutesWidget = createWidget(RoutesModelProvider, RoutesView);
