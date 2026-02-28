import { observer } from 'mobx-react-lite';
import { createWidget } from '@core/di';
import { Line } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { styleVars } from '@ui';
import { RouteCreationModelProvider, useRouteCreationModel } from './model';

const ROUTE_PREVIEW = { WIDTH: 5 };

const RouteCreationView = observer(function RouteCreationView() {
  const camera = useThree(state => state.camera);
  const { getPreviewPoints, isDragging } = useRouteCreationModel();

  const previewPoints = getPreviewPoints(camera.position);

  if (!isDragging || previewPoints.length < 2) return null;

  return (
    <Line
      points={previewPoints}
      color={styleVars.colorItem}
      lineWidth={ROUTE_PREVIEW.WIDTH}
      transparent
      opacity={0.6}
      raycast={() => null}
    />
  );
});

export const RouteCreationWidget = createWidget(
  RouteCreationModelProvider,
  RouteCreationView,
);
