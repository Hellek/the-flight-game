import { makeAutoObservable } from 'mobx';
import { Aircraft, AircraftSize } from '../types/types';

export class AircraftStore {
  aircrafts: Aircraft[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  createAircraft(routeId: string, type: AircraftSize) {
    const aircraft: Aircraft = {
      id: `aircraft-${Date.now()}`,
      type,
      speed: type * 100, // Скорость зависит от размера самолета
      routeId,
      position: { x: 0, y: 0 } // Начальная позиция будет установлена при запуске
    };

    this.aircrafts.push(aircraft);
    return aircraft;
  }

  getAircraftsByRouteId(routeId: string) {
    return this.aircrafts.filter(aircraft => aircraft.routeId === routeId);
  }

  removeAircraft(id: string) {
    this.aircrafts = this.aircrafts.filter(aircraft => aircraft.id !== id);
  }
}
