import { init, Props, scope } from '@core/di';
import { type Cities, type City, CityService, EntityTypeEnum, SelectionService } from '@services';

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
  ) { }

  [init](props: CitiesModelProps): void {
    this.cityService.setCities(props.cities);
  }

  get cities(): City[] {
    return this.cityService.cities;
  }

  get selectedCity(): City | null {
    const { selectedEntity } = this.selectionService;
    return selectedEntity?.type === EntityTypeEnum.city ? selectedEntity.data : null;
  }

  selectCity = (city: City): void => {
    this.selectionService.selectCity(city);
  };
}
