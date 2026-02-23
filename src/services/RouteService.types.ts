import type { Aircraft } from './AircraftService.types';
import type { City } from './CityService.types';

/**
 * Маршрут
 */
export interface Route {
  id: string;
  departureCity: City;
  arrivalCity: City;
  aircrafts: Aircraft[];
  distance: number;
}

/**
 * Маршруты
 */
export type Routes = Route[];
