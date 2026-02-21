import { scope } from '@core/di';
import {
  type Aircraft,
  AircraftService,
  EntityTypeEnum,
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
  ) {}

  get aircrafts(): Aircraft[] {
    return this.aircraftService.aircrafts;
  }

  getAircraftPosition = (aircraft: Aircraft) => {
    return this.aircraftService.getAircraftPosition(aircraft);
  };
  getAircraftRotation = (aircraft: Aircraft): [number, number, number] => {
    return this.aircraftService.getAircraftRotation(aircraft);
  };

  get selectedAircraft(): Aircraft | null {
    const { selectedEntity } = this.selectionService;
    return selectedEntity?.type === EntityTypeEnum.aircraft ? selectedEntity.data : null;
  }

  selectAircraft = (aircraft: Aircraft): void => {
    this.selectionService.selectAircraft(aircraft);
  };
}
