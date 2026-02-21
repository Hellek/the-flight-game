import { makeAutoObservable } from 'mobx';
import { scope } from '@core/di';
import { type Aircraft, type City, EntityTypeEnum, type Route } from './types';

type SelectedEntity = {
  type: EntityTypeEnum.city
  data: City
} | {
  type: EntityTypeEnum.route
  data: Route
} | {
  type: EntityTypeEnum.aircraft
  data: Aircraft
} | {
  type: EntityTypeEnum.changelog
  data: null
} | null;

@scope.singleton()
export class SelectionService {
  selectedEntity: SelectedEntity | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  selectCity(city: City) {
    this.selectedEntity = {
      type: EntityTypeEnum.city,
      data: city,
    };
  }

  selectRoute(route: Route) {
    this.selectedEntity = {
      type: EntityTypeEnum.route,
      data: route,
    };
  }

  selectAircraft(aircraft: Aircraft) {
    this.selectedEntity = {
      type: EntityTypeEnum.aircraft,
      data: aircraft,
    };
  }

  selectChangelog() {
    this.selectedEntity = {
      type: EntityTypeEnum.changelog,
      data: null,
    };
  }

  clearSelection() {
    this.selectedEntity = null;
  }
}
