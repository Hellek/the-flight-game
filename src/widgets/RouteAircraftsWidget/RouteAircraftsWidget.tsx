import { observer } from 'mobx-react-lite';
import { Heading } from '@components/ui';
import { createWidget } from '@core/di';
import { RouteAircraftsModelProvider, useRouteAircraftsModel } from './model';

const RouteAircraftsView = observer(function RouteAircraftsView() {
  const { aircrafts, getAircraftSizeName } = useRouteAircraftsModel();

  return (
    <div className="space-y-2">
      <Heading level={4} className="text-sm font-medium text-slate-700">
        Самолеты на маршруте
      </Heading>

      {aircrafts.length > 0 ? (
        <div className="space-y-2">
          {aircrafts.map(aircraft => (
            <div key={aircraft.id} className="
              flex items-center justify-between text-sm
            ">
              <span>{getAircraftSizeName(aircraft.type)}</span>
              <span className="text-slate-500">{aircraft.speed} км/ч</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-500">Нет самолетов на маршруте</div>
      )}
    </div>
  );
});

export const RouteAircraftsWidget = createWidget(RouteAircraftsModelProvider, RouteAircraftsView);
