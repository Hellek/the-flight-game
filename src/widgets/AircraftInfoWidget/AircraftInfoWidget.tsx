import { observer } from 'mobx-react-lite';
import { createWidget } from '@core/di';
import { AircraftInfoModelProvider, useAircraftInfoModel } from './model';

const AircraftInfoView = observer(function AircraftInfoView() {
  const { aircraftName, progressPercent, flight, routeDistance, speed } = useAircraftInfoModel();

  return (
    <>
      <div className="flex justify-between text-sm text-slate-600">
        <span>Тип:</span>
        <span className="font-medium">{aircraftName}</span>
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Маршрут:</span>
        <span className="font-medium">{flight}</span>
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Прогресс:</span>
        <span className="font-medium">{progressPercent}%</span>
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Расстояние:</span>
        <span className="font-medium">{routeDistance}</span>
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Скорость:</span>
        <span className="font-medium">{speed} км/ч</span>
      </div>
    </>
  );
});

export const AircraftInfoWidget = createWidget(AircraftInfoModelProvider, AircraftInfoView);
