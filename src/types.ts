/**
 * Географические координаты
 */
export interface Coordinates {
  lon: number;
  lat: number;
}

/**
 * Положение
 */
export interface Position {
  x: number;
  y: number;
  z: number;
}

/**
 * Географические координаты города
 */
export interface CityGeo {
  name: string;
  iata: string;
  lon: Coordinates['lon'];
  lat: Coordinates['lat'];
}
