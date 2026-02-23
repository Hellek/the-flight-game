import type { Aircraft } from '../AircraftService/AircraftService.types';
import type { City } from '../CityService/CityService.types';

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
