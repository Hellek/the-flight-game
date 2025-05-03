import { AirportStore } from './AirportStore';
import { RouteStore } from './RouteStore';
import { SelectionStore } from './SelectionStore';
import { WorldStore } from './WorldStore';
import { AircraftStore } from './AircraftStore';

export class RootStore {
  airportStore: AirportStore;
  routeStore: RouteStore;
  selectionStore: SelectionStore;
  worldStore: WorldStore;
  aircraftStore: AircraftStore;

  constructor() {
    this.airportStore = new AirportStore();
    this.routeStore = new RouteStore();
    this.selectionStore = new SelectionStore();
    this.worldStore = new WorldStore();
    this.aircraftStore = new AircraftStore();
  }
}

export const rootStore = new RootStore();
