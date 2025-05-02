import React from 'react';
import { Airport as AirportType } from '../types/types';

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
  onClose?: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ selectedEntity, onClose }) => {
  if (!selectedEntity) return null;

  const renderContent = () => {
    switch (selectedEntity.type) {
      case 'airport':
        const airport = selectedEntity.data;
        return (
          <>
            <h3 className="font-bold text-lg">{airport.name}</h3>
            <p className="text-sm text-gray-600">
              Координаты: ({Math.round(airport.position.x)}, {Math.round(airport.position.y)})
            </p>
          </>
        );

      case 'route':
        const { departure, arrival } = selectedEntity.data;
        const distance = Math.sqrt(
          Math.pow(arrival.position.x - departure.position.x, 2) +
          Math.pow(arrival.position.y - departure.position.y, 2)
        );
        return (
          <>
            <h3 className="font-bold text-lg">Маршрут</h3>
            <p className="text-sm text-gray-600">
              {departure.name} → {arrival.name}
            </p>
            <p className="text-sm text-gray-600">
              Расстояние: {Math.round(distance)} км
            </p>
          </>
        );
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-2">
        {renderContent()}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
