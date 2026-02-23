import type { Vector3 } from 'three';

/**
 * Город
 */
export interface City {
  name: string
  iata: string
  position: Vector3
}

/**
 * Список городов
 */
export type Cities = City[];
