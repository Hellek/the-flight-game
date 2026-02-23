import { makeAutoObservable } from 'mobx';
import { scope } from '@core/di';
import type { Aircraft } from '../AircraftService/AircraftService.types';
import type { City } from '../CityService/CityService.types';
import type { Route } from '../RouteService/RouteService.types';
import { type SelectedEntity, SelectedEntityType } from './SelectionService.types';

@scope.singleton()
export class SelectionService {
  selectedEntity: SelectedEntity | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  selectCity(city: City) {
    this.selectedEntity = {
      type: SelectedEntityType.city,
      data: city,
    };
  }

  selectRoute(route: Route) {
    this.selectedEntity = {
      type: SelectedEntityType.route,
      data: route,
    };
  }

  selectAircraft(aircraft: Aircraft) {
    this.selectedEntity = {
      type: SelectedEntityType.aircraft,
      data: aircraft,
    };
  }

  selectChangelog() {
    this.selectedEntity = {
      type: SelectedEntityType.changelog,
      data: null,
    };
  }

  clearSelection() {
    this.selectedEntity = null;
  }
}
