import { makeAutoObservable } from 'mobx';
import { scope } from '@core/di';
import type { Cities } from './types';

@scope.singleton()
export class CityService {
  cities: Cities = [];

  constructor() {
    makeAutoObservable(this);
  }

  /** Устанавливает список городов. Допускается повторный вызов при перемонтировании виджета (например, после смены роута). */
  setCities(cities: Cities): void {
    this.cities = cities;
  }
}
