import React from 'react';
import { Airport as AirportType } from '../types/types';
import { PanelHeader } from './info-panel/PanelHeader';
import { AirportInfo } from './info-panel/AirportInfo';
import { RouteInfo } from './info-panel/RouteInfo';

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

interface InfoPanelProps {
  selectedEntity: SelectedEntity;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ selectedEntity, onClose }) => {
  if (!selectedEntity) return null;

  return (
    <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden">
      <PanelHeader
        title={selectedEntity.type === 'airport' ? 'Аэропорт' : 'Маршрут'}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        {selectedEntity.type === 'airport' ? (
          <AirportInfo airport={selectedEntity.data} />
        ) : (
          <RouteInfo
            departure={selectedEntity.data.departure}
            arrival={selectedEntity.data.arrival}
          />
        )}
      </div>
    </div>
  );
};
