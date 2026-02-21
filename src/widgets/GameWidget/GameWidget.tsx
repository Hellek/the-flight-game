import { observer } from 'mobx-react-lite';
import { GlobeSphere } from '@components/GlobeSphere/GlobeSphere';
import { createWidget } from '@core/di';
import { Canvas } from '@react-three/fiber';
import { AircraftsWidget } from '@widgets/AircraftsWidget';
import { CitiesWidget } from '@widgets/CitiesWidget';
import { InfoPanelWidget } from '@widgets/InfoPanelWidget';
import { RoutesWidget } from '@widgets/RoutesWidget';
import { GameControls } from './components/GameControls';
import { GameModelProvider, useGameModel } from './model';

const GameView = observer(function GameView() {
  const { world, showRoutes } = useGameModel();

  return (
    <div className="grow w-full relative">
      <Canvas>
        <ambientLight intensity={3} />
        <group>
          <GlobeSphere />
          <CitiesWidget cities={world?.cities ?? []} />
          {showRoutes && <RoutesWidget routes={world?.routes ?? []} />}
          <AircraftsWidget />
        </group>
        <GameControls />
      </Canvas>
      <InfoPanelWidget />
    </div>
  );
});

export const GameWidget = createWidget(GameModelProvider, GameView);
