import { observer } from 'mobx-react-lite';
import { createWidget } from '@core/di';
import { Canvas } from '@react-three/fiber';
import { AircraftsWidget } from '@widgets/AircraftsWidget';
import { CitiesWidget } from '@widgets/CitiesWidget';
import { GameControls } from '@widgets/GameWidget/components/GameControls';
import { GlobeSphereWidget } from '@widgets/GlobeSphereWidget';
import { RouteCreationWidget } from '@widgets/RouteCreationWidget';
import { RoutesWidget } from '@widgets/RoutesWidget';
import { GameModelProvider, useGameModel } from './model';

const GameView = observer(function GameView() {
  const { globeInitialRotation } = useGameModel();

  return (
    <div className="relative w-full grow">
      <Canvas>
        <ambientLight intensity={3} />
        <group rotation={globeInitialRotation}>
          <GlobeSphereWidget />
          <CitiesWidget />
          <RoutesWidget />
          <RouteCreationWidget />
          <AircraftsWidget />
        </group>
        <GameControls />
      </Canvas>
    </div>
  );
});

export const GameWidget = createWidget(GameModelProvider, GameView);
