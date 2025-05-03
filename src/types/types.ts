type AircraftSize = 1 | 2 | 3 | 4 | 5

interface Aircraft {
  id: string;
  type: AircraftSize;
  speed: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Airport {
  id: string;
  name: string;
  city: string;
  position: Position;
}

// Типы для маршрута
export interface Route {
  id: string;
  departureId: string;
  arrivalId: string;
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
