import { observer } from 'mobx-react-lite';
import { createWidget } from '@core/di';
import { CreateAircraftWidget } from '@widgets/CreateAircraftWidget';
import { RouteAircraftsWidget } from '@widgets/RouteAircraftsWidget';
import { RouteInfoModelProvider, useRouteInfoModel } from './model';

const RouteInfoView = observer(function RouteInfoView() {
  const { route, departureCity, arrivalCity, distanceInKm } = useRouteInfoModel();

  return (
    <>
      <div className="flex justify-between text-sm text-slate-600">
        <span>Пункты:</span>
        <span className="font-medium">
          {departureCity.name} - {arrivalCity.name}
        </span>
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Расстояние:</span>
        <span className="font-medium">{distanceInKm} км</span>
      </div>

      <div className="border-t border-slate-200 pt-2">
        <RouteAircraftsWidget route={route} />
      </div>

      <div className="border-t border-slate-200 pt-2">
        <CreateAircraftWidget route={route} />
      </div>
    </>
  );
});

export const RouteInfoWidget = createWidget(RouteInfoModelProvider, RouteInfoView);
