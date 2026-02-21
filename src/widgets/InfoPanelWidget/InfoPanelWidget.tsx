import { observer } from 'mobx-react-lite';
import { createWidget } from '@core/di';
import { EntityTypeEnum } from '@services';
import { AircraftInfo } from './components/AircraftInfo';
import { ChangelogInfo } from './components/ChangelogInfo';
import { CityInfo } from './components/CityInfo';
import { PanelHeader } from './components/PanelHeader';
import { RouteInfo } from './components/RouteInfo';
import { InfoPanelModelProvider, useInfoPanelModel } from './model';

const InfoPanelView = observer(function InfoPanelView() {
  const { selectedEntity, clearSelection, getDirectDistance, createAircraft } =
    useInfoPanelModel();

  if (!selectedEntity) return null;

  const getPanelConfig = () => {
    switch (selectedEntity.type) {
      case EntityTypeEnum.city:
        return {
          title: 'Город',
          component: <CityInfo city={selectedEntity.data} />,
        };
      case EntityTypeEnum.route:
        return {
          title: 'Маршрут',
          component: (
            <RouteInfo
              route={selectedEntity.data}
              getDirectDistance={getDirectDistance}
              onCreateAircraft={createAircraft}
            />
          ),
        };
      case EntityTypeEnum.aircraft:
        return {
          title: 'Самолет',
          component: <AircraftInfo aircraft={selectedEntity.data} />,
        };
      case EntityTypeEnum.changelog:
        return {
          title: 'Изменения',
          component: <ChangelogInfo />,
        };
      default:
        return { title: '', component: null };
    }
  };

  const { title, component } = getPanelConfig();

  return (
    <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-6rem)] bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <PanelHeader title={title} onClose={clearSelection} />

      <div className="p-4 space-y-3 overflow-y-auto flex-1">{component}</div>
    </div>
  );
});

export const InfoPanelWidget = createWidget(InfoPanelModelProvider, InfoPanelView);
