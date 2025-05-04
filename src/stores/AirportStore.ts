import { makeAutoObservable } from 'mobx';
import { Airport } from '../types/types';

export class AirportStore {
  airports: Airport[] = [];
  selectedAirport: Airport | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAirports(airports: Airport[]) {
    this.airports = airports;
  }

  selectAirport(airport: Airport | null) {
    this.selectedAirport = airport;
  }
}
