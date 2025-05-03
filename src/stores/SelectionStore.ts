import { makeAutoObservable } from 'mobx';
import { Airport, Route } from '../types/types';

type SelectedEntity = {
  type: 'airport';
  data: Airport;
} | {
  type: 'route';
  data: Route;
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

  selectRoute(route: Route | null) {
    if (!route) {
      this.selectedEntity = null;
      return;
    }
    this.selectedEntity = {
      type: 'route',
      data: route
    };
  }

  clearSelection() {
    this.selectedEntity = null;
  }
}
