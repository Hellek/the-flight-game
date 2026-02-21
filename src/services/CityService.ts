import { makeAutoObservable } from 'mobx';
import { scope } from '@core/di';
import { LoggerService } from './LoggerService';
import type { Cities } from './types';

@scope.singleton()
export class CityService {
  cities: Cities = [];
  private initialized = false;

  constructor(private readonly logger: LoggerService) {
    makeAutoObservable(this);
  }

  initialSet(cities: Cities): void {
    if (this.initialized) {
      this.logger.error('CityService.init() must not be called more than once', { throw: true });
    }

    this.initialized = true;
    this.cities = cities;
  }
}
