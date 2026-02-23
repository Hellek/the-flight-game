import type { Aircraft } from '../AircraftService/AircraftService.types';
import type { City } from '../CityService/CityService.types';
import type { Route } from '../RouteService/RouteService.types';

/**
 * enum сущностей
 */
export enum EntityTypeEnum {
  city = 'city',
  route = 'route',
  aircraft = 'aircraft',
  changelog = 'changelog',
}

export type SelectedEntity = {
  type: EntityTypeEnum.city
  data: City
} | {
  type: EntityTypeEnum.route
  data: Route
} | {
  type: EntityTypeEnum.aircraft
  data: Aircraft
} | {
  type: EntityTypeEnum.changelog
  data: null
};
