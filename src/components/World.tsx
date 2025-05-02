import React, { useState } from 'react';
import { World as WorldType, Airport as AirportType } from '../types/types';
import { generateTestWorld } from '../utils/worldGenerator';
import { Airports } from './Airports';
import { Routes } from './Routes';
import { WorldBackground } from './WorldBackground';
import { InfoPanel } from './InfoPanel';

interface WorldProps {
  world?: WorldType;
}

type SelectedEntity = {
  type: 'airport';
  data: AirportType;
} | {
  type: 'route';
  data: {
    departure: AirportType;
    arrival: AirportType;
  };
} | null;

export const World: React.FC<WorldProps> = ({ world = generateTestWorld() }) => {
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>(null);

  const handleAirportClick = (airport: AirportType) => {
    setSelectedEntity({
      type: 'airport',
      data: airport
    });
  };

  const handleRouteClick = (departure: AirportType, arrival: AirportType) => {
    setSelectedEntity({
      type: 'route',
      data: { departure, arrival }
    });
  };

  const handleCloseInfo = () => {
    setSelectedEntity(null);
  };

  return (
    <div className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${world.size.width} ${world.size.height}`}
        className="absolute inset-0"
      >
        <WorldBackground width={world.size.width} height={world.size.height} />

        {/* Маршруты */}
        <Routes
          airports={world.airports}
          onRouteClick={handleRouteClick}
        />

        {/* Аэропорты */}
        <Airports
          airports={world.airports}
          onAirportClick={handleAirportClick}
        />
      </svg>

      {/* Информационная панель */}
      <InfoPanel
        selectedEntity={selectedEntity}
        onClose={handleCloseInfo}
      />
    </div>
  );
};
