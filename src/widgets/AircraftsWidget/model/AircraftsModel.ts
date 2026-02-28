import { scope } from '@core/di';
import { GeometryPlugin } from '@plugins';
import {
  type Aircraft,
  AircraftService,
  SelectedEntityType,
  SelectionService,
} from '@services';

/**
 * ViewModel виджета воздушных судов
 */
@scope.transient()
export class AircraftsModel {
  constructor(
    private readonly aircraftService: AircraftService,
    private readonly selectionService: SelectionService,
    private readonly geometry: GeometryPlugin,
  ) { }

  get aircrafts(): Aircraft[] {
    return this.aircraftService.aircrafts;
  }

  // TODO а тут можно сделать через get?
  getAircraftPosition = (aircraft: Aircraft) => {
    return this.aircraftService.getAircraftPosition(aircraft);
  };
  getAircraftRotation = (aircraft: Aircraft) => {
    return this.aircraftService.getAircraftRotation(aircraft);
  };

  get selectedAircraft(): Aircraft | null {
    const { selectedEntity } = this.selectionService;
    return selectedEntity?.type === SelectedEntityType.aircraft ? selectedEntity.data : null;
  }

  selectAircraft = (aircraft: Aircraft): void => {
    this.selectionService.selectAircraft(aircraft);
  };

  get globeInitialRotation() {
    return this.geometry.globeInitialRotation;
  }
}
