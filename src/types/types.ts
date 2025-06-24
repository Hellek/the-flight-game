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
  small = 'small', // маленькие самолёты (например, Cessna)
  medium = 'medium', // средние самолёты (например, Boeing 737)
  large = 'large', // большие самолёты (например, Boeing 777)
  xlarge = 'xlarge', // очень большие самолёты (например, Boeing 747)
  xxlarge = 'xxlarge', // гигантские самолёты (например, Airbus A380)
}

export enum AircraftDirection {
  forward = 'forward',
  backward = 'backward',
}

// Самолет
export interface Aircraft {
  id: string;
  type: AircraftSize;
  speed: number;
  route: Route;
  progress: number; // Прогресс движения по маршруту (0-1)
  direction: AircraftDirection; // Направление движения
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

export interface WorldInitials {
  cities: City[];
  routes: Route[];
}
