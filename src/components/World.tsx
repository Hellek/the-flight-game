import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Airports } from './Airports';
import { Routes } from './Routes';
import { InfoPanel } from './InfoPanel';
import { WorldBackground } from './WorldBackground';
import { rootStore } from '../stores/RootStore';
import { World as WorldType } from '../types/types';

export const World: React.FC<{ world: WorldType }> = observer(({ world }) => {
  useEffect(() => {
    rootStore.worldStore.setWorld(world);
    rootStore.airportStore.setAirports(world.airports);
    rootStore.routeStore.setRoutes(world.routes);
  }, []);

  return (
    <div className="relative w-full h-screen bg-slate-50">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${world.size.width} ${world.size.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <WorldBackground width={world.size.width} height={world.size.height} />
        <Routes />
        <Airports />
      </svg>

      <InfoPanel />
    </div>
  );
});
