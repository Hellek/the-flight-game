import type { Position } from '@types';

/**
 * Город
 */
export interface City {
  name: string
  iata: string
  position: Position
}

/**
 * Список городов
 */
export type Cities = City[];

/**
 * Размер самолета
 */
export enum AircraftSize {
  small = 'small', // маленькие самолёты (например, Cessna)
  medium = 'medium', // средние самолёты (например, Boeing 737)
  large = 'large', // большие самолёты (например, Boeing 777)
  xlarge = 'xlarge', // очень большие самолёты (например, Boeing 747)
  xxlarge = 'xxlarge', // гигантские самолёты (например, Airbus A380)
}

/**
 * Направление движения самолета
 */
export enum AircraftDirection {
  forward = 'forward',
  backward = 'backward',
}

/**
 * Воздушное судно
 */
export interface Aircraft {
  id: string;
  type: AircraftSize;
  speed: number;
  route: Route;
  progress: number; // Прогресс движения по маршруту (0-1)
  direction: AircraftDirection; // Направление движения
}

/**
 * Воздушные суда
 */
export type Aircrafts = Aircraft[];

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

/**
 * enum сущностей
 */
export enum EntityTypeEnum {
  city = 'city',
  route = 'route',
  aircraft = 'aircraft',
  changelog = 'changelog',
}
