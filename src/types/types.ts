// Географические координаты
export interface Coordinates {
  lon: number;
  lat: number;
}

// Положение
export interface Position {
  x: number;
  y: number;
  z: number;
}

// Размер самолета
export enum AircraftSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
  xlarge = 'xlarge',
  xxlarge = 'xxlarge',
}

// Самолет
export interface Aircraft {
  id: string;
  type: AircraftSize;
  speed: number;
  route: Route;
  position: Position;
  progress: number; // Прогресс движения по маршруту (0-1)
  direction: 'forward' | 'backward'; // Направление движения
}

// Географические координаты города
export interface CityGeo {
  name: string;
  iata: string;
  lon: Coordinates['lon'];
  lat: Coordinates['lat'];
}

// Город в игровом мире
export interface City {
  name: string;
  iata: string;
  position: Position;
}

// Маршрут
export interface Route {
  id: string;
  departureCity: City;
  arrivalCity: City;
  aircrafts: Aircraft[];
  distance: number;
}

// Мир
export interface World {
  cities: City[];
  routes: Route[];
}
