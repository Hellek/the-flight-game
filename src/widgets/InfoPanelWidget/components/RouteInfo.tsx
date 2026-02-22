import type { AircraftSize, Route } from '@services';
import { CreateAircraft } from './CreateAircraft';
import { RouteAircrafts } from './RouteAircrafts';

interface RouteInfoProps {
  route: Route;
  getDirectDistance: (route: Route) => number;
  onCreateAircraft: (route: Route, type: AircraftSize) => void;
}

export function RouteInfo({ route, getDirectDistance, onCreateAircraft }: RouteInfoProps) {
  const { departureCity, arrivalCity } = route;
  const distanceInKm = Math.round(getDirectDistance(route));

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
        <RouteAircrafts route={route} />
      </div>

      <div className="border-t border-slate-200 pt-2">
        <CreateAircraft route={route} onCreate={onCreateAircraft} />
      </div>
    </>
  );
}
