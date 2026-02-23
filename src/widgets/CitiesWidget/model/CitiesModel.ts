import { init, Props, scope } from '@core/di';
import { GameSettingsPlugin } from '@plugins';
import {
  type Cities,
  type City,
  CityService,
  SelectedEntityType,
  SelectionService,
} from '@services';

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
    private readonly selectionService: SelectionService,
    private readonly gameSettingsPlugin: GameSettingsPlugin,
  ) { }

  [init](props: CitiesModelProps): void {
    this.cityService.setCities(props.cities);
  }

  get cities(): City[] {
    return this.cityService.cities;
  }

  get selectedCity(): City | null {
    const { selectedEntity } = this.selectionService;
    return selectedEntity?.type === SelectedEntityType.city ? selectedEntity.data : null;
  }

  selectCity = (city: City): void => {
    this.selectionService.selectCity(city);
  };

  get globeInitialRotation() {
    return this.gameSettingsPlugin.globeInitialRotation;
  }
}
