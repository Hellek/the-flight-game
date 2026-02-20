import React from 'react'
import { observer } from 'mobx-react-lite'
import { rootStore } from '../stores'
import { AircraftInfo, ChangelogInfo, CityInfo, PanelHeader, RouteInfo } from './info-panel'

export const InfoPanel: React.FC = observer(() => {
  const { selectedEntity } = rootStore.selection

  if (!selectedEntity) return null

  const getPanelConfig = () => {
    switch (selectedEntity.type) {
      case 'city':
        return {
          title: 'Город',
          component: <CityInfo city={selectedEntity.data} />,
        }
      case 'route':
        return {
          title: 'Маршрут',
          component: <RouteInfo route={selectedEntity.data} />,
        }
      case 'aircraft':
        return {
          title: 'Самолет',
          component: <AircraftInfo aircraft={selectedEntity.data} />,
        }
      case 'changelog':
        return {
          title: 'Изменения',
          component: <ChangelogInfo />,
        }
      default:
        return {
          title: '',
          component: null,
        }
    }
  }

  const { title, component } = getPanelConfig()

  return (
    <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-6rem)] bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <PanelHeader
        title={title}
        onClose={() => rootStore.selection.clearSelection()}
      />

      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        {component}
      </div>
    </div>
  )
})
