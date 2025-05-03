import { makeAutoObservable } from 'mobx';
import { Airport } from '../types/types';

type SelectedEntity = {
  type: 'airport';
  data: Airport;
} | {
  type: 'route';
  data: {
    departure: Airport;
    arrival: Airport;
  };
} | null;

export class SelectionStore {
  selectedEntity: SelectedEntity = null;

  constructor() {
    makeAutoObservable(this);
  }

  selectAirport(airport: Airport | null) {
    if (!airport) {
      this.selectedEntity = null;
      return;
    }
    this.selectedEntity = {
      type: 'airport',
      data: airport
    };
  }

  selectRoute(departure: Airport, arrival: Airport) {
    this.selectedEntity = {
      type: 'route',
      data: {
        departure,
        arrival
      }
    };
  }

  clearSelection() {
    this.selectedEntity = null;
  }
}
