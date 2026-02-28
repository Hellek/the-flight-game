import { scope } from '@core/di';
import { GeometryPlugin } from '@plugins';
import { type City, CityService } from '@services';

/**
 * ViewModel виджета городов
 */
@scope.transient()
export class CitiesModel {
  constructor(
    private readonly cityService: CityService,
    private readonly geometry: GeometryPlugin,
  ) { }

  get cities(): City[] {
    return this.cityService.cities;
  }

  get globeInitialRotation() {
    return this.geometry.globeInitialRotation;
  }
}
