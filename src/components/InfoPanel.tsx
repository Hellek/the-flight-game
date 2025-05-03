import React from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../stores/RootStore';
import { PanelHeader } from './info-panel/PanelHeader';
import { AirportInfo } from './info-panel/AirportInfo';
import { RouteInfo } from './info-panel/RouteInfo';

export const InfoPanel: React.FC = observer(() => {
  const { selectedEntity } = rootStore.selectionStore;

  if (!selectedEntity) return null;

  return (
    <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden">
      <PanelHeader
        title={selectedEntity.type === 'airport' ? 'Аэропорт' : 'Маршрут'}
        onClose={() => rootStore.selectionStore.clearSelection()}
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
});
