import React from 'react';
import { observer } from 'mobx-react-lite';
import { type Route } from '../../types/types';
import { InfoSection } from './InfoSection';
import { rootStore } from '../../stores/RootStore';
import { CreateAircraft } from './CreateAircraft';

interface RouteInfoProps {
  route: Route;
}

export const RouteInfo: React.FC<RouteInfoProps> = observer(({ route }) => {
  const { departureAirport, arrivalAirport, aircrafts } = route;

  const distance = Math.sqrt(
    Math.pow(arrivalAirport.position.x - departureAirport.position.x, 2) +
    Math.pow(arrivalAirport.position.y - departureAirport.position.y, 2)
  );

  const world = rootStore.worldStore.world;
  const distanceInKm = Math.round(distance * (world?.scale || 100));

  return (
    <div className="space-y-4">
      <InfoSection title="Между">
        <div>
          {departureAirport.city} - {arrivalAirport.city}
        </div>
      </InfoSection>

      <div className="pt-2 border-t border-slate-200">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Расстояние:</span>
          <span className="font-medium">{distanceInKm} км</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Самолеты на маршруте</h4>
          {aircrafts.length > 0 ? (
            <div className="space-y-2">
              {aircrafts.map(aircraft => (
                <div key={aircraft.id} className="flex items-center justify-between text-sm">
                  <span>Тип {aircraft.type}</span>
                  <span className="text-slate-500">{aircraft.speed} км/ч</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500">Нет самолетов на маршруте</div>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200">
        <CreateAircraft route={route} />
      </div>
    </div>
  );
});
