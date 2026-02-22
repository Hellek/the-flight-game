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
    <div className="
      absolute top-4 right-4 flex max-h-[calc(100vh-6rem)] w-80 flex-col
      overflow-hidden rounded-lg bg-white shadow-lg
    ">
      <PanelHeader title={title} onClose={clearSelection} />

      <div className="flex-1 space-y-3 overflow-y-auto p-4">{component}</div>
    </div>
  );
});

export const InfoPanelWidget = createWidget(InfoPanelModelProvider, InfoPanelView);
