import type { Route } from '../RouteService/RouteService.types';

/**
 * Размер самолета
 */
export enum AircraftSize {
  /**
   * маленькие самолёты (например, Cessna)
   */
  small = 'small',
  /**
   * средние самолёты (например, Boeing 737)
   */
  medium = 'medium',
  /**
   * большие самолёты (например, Boeing 777)
   */
  large = 'large',
  /**
   * очень большие самолёты (например, Boeing 747)
   */
  xlarge = 'xlarge',
  /**
   * гигантские самолёты (например, Airbus A380)
   */
  xxlarge = 'xxlarge',
}

/**
 * Базовые скорости в км/ч для разных типов самолётов
 */
export const AircraftSpeed = {
  [AircraftSize.small]: 640,
  [AircraftSize.medium]: 720,
  [AircraftSize.large]: 800,
  [AircraftSize.xlarge]: 880,
  [AircraftSize.xxlarge]: 960,
};

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
  /** Прогресс движения по маршруту (0-1) */
  progress: number;
  /** Направление движения */
  direction: AircraftDirection;
}

/**
 * Воздушные суда
 */
export type Aircrafts = Aircraft[];
