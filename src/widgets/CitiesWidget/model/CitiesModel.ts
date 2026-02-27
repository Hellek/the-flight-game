import { init, Props, scope } from '@core/di';
import { GameSettingsPlugin } from '@plugins';
import { type Cities, type City, CityService } from '@services';

export interface CitiesModelProps {
  cities: Cities;
}

/**
 * ViewModel виджета городов
 */
@scope.transient()
export class CitiesModel {
  constructor(
    public readonly props: Props<CitiesModelProps>,
    private readonly cityService: CityService,
    private readonly gameSettingsPlugin: GameSettingsPlugin,
  ) { }

  [init](props: CitiesModelProps): void {
    this.cityService.setCities(props.cities);
  }

  get cities(): City[] {
    return this.cityService.cities;
  }

  get globeInitialRotation() {
    return this.gameSettingsPlugin.globeInitialRotation;
  }
}
