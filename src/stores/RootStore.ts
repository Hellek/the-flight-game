import { AirportStore } from './AirportStore';
import { RouteStore } from './RouteStore';
import { SelectionStore } from './SelectionStore';
import { WorldStore } from './WorldStore';

export class RootStore {
  airportStore: AirportStore;
  routeStore: RouteStore;
  selectionStore: SelectionStore;
  worldStore: WorldStore;

  constructor() {
    this.airportStore = new AirportStore();
    this.routeStore = new RouteStore();
    this.selectionStore = new SelectionStore();
    this.worldStore = new WorldStore();
  }
}

export const rootStore = new RootStore();
