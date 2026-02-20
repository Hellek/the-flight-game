import { makeAutoObservable } from 'mobx'
import type { Aircraft, City, Route } from '../types'

type SelectedEntity = {
  type: 'city';
  data: City;
} | {
  type: 'route';
  data: Route;
} | {
  type: 'aircraft';
  data: Aircraft;
} | {
  type: 'changelog';
  data: null;
} | null

export class SelectionStore {
  selectedEntity: SelectedEntity = null

  constructor() {
    makeAutoObservable(this)
  }

  selectCity(city: City | null) {
    if (!city) {
      this.selectedEntity = null
      return
    }

    this.selectedEntity = {
      type: 'city',
      data: city,
    }
  }

  selectRoute(route: Route | null) {
    if (!route) {
      this.selectedEntity = null
      return
    }

    this.selectedEntity = {
      type: 'route',
      data: route,
    }
  }

  selectAircraft(aircraft: Aircraft | null) {
    if (!aircraft) {
      this.selectedEntity = null
      return
    }

    this.selectedEntity = {
      type: 'aircraft',
      data: aircraft,
    }
  }

  selectChangelog() {
    this.selectedEntity = {
      type: 'changelog',
      data: null,
    }
  }

  clearSelection() {
    this.selectedEntity = null
  }
}
