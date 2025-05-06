export type AircraftSize = 1 | 2 | 3 | 4 | 5;

export interface Aircraft {
  id: string;
  type: AircraftSize;
  speed: number;
  route: Route;
  position: Position;
  progress: number; // Прогресс движения по маршруту (0-1)
  direction: 'forward' | 'backward'; // Направление движения
}

export interface Position {
  x: number;
  y: number;
}

export interface Airport {
  id: string;
  name: string;
  city: string;
  iata: string;
  position: Position;
}

// Типы для маршрута
export interface Route {
  id: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  aircrafts: Aircraft[];
}

export interface World {
  airports: Airport[];
  routes: Route[];
  size: {
    width: number;  // ширина игрового мира
    height: number; // высота игрового мира
  };
  // Масштаб для перевода игровых координат в реальные километры
  scale: number; // километров на единицу координат
}
