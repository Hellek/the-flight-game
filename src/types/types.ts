type AircraftSize = 1 | 2 | 3 | 4 | 5

interface Aircraft {
  id: string;
  type: AircraftSize;
  speed: number;
}

export interface Airport {
  id: string;
  name: string;
  position: {
    x: number; // координата X в игровом мире
    y: number; // координата Y в игровом мире
  };
}

// Типы для маршрута
interface Route {
  id: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  distance: number; // в километрах
  estimatedTime: number; // в минутах
}

export interface World {
  airports: Airport[];
  size: {
    width: number;  // ширина игрового мира
    height: number; // высота игрового мира
  };
  // Масштаб для перевода игровых координат в реальные километры
  scale: number; // километров на единицу координат
}
