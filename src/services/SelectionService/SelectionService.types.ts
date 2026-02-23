import type { Aircraft } from '../AircraftService/AircraftService.types';
import type { City } from '../CityService/CityService.types';
import type { Route } from '../RouteService/RouteService.types';

/**
 * enum сущностей
 */
export enum SelectedEntityType {
  city = 'city',
  route = 'route',
  aircraft = 'aircraft',
  changelog = 'changelog',
}

export type SelectedEntity = {
  type: SelectedEntityType.city
  data: City
} | {
  type: SelectedEntityType.route
  data: Route
} | {
  type: SelectedEntityType.aircraft
  data: Aircraft
} | {
  type: SelectedEntityType.changelog
  data: null
};
