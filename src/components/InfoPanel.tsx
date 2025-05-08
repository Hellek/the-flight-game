import React from 'react'
import { observer } from 'mobx-react-lite'

import { rootStore } from '../stores'
import { AircraftInfo, CityInfo, PanelHeader, RouteInfo } from './info-panel'

export const InfoPanel: React.FC = observer(() => {
  const { selectedEntity } = rootStore.selectionStore

  if (!selectedEntity) return null

  const title = selectedEntity.type === 'city' ? 'Город' : selectedEntity.type === 'route' ? 'Маршрут' : 'Самолет'

  return (
    <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden">
      <PanelHeader
        title={title}
        onClose={() => rootStore.selectionStore.clearSelection()}
      />

      <div className="p-4 space-y-3">
        {selectedEntity.type === 'city' && (
          <CityInfo city={selectedEntity.data} />
        )}
        {selectedEntity.type === 'route' && (
          <RouteInfo route={selectedEntity.data} />
        )}
        {selectedEntity.type === 'aircraft' && (
          <AircraftInfo aircraft={selectedEntity.data} />
        )}
      </div>
    </div>
  )
})
