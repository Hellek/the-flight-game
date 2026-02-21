import { scope } from '@core/di';
import {
  AircraftService,
  type AircraftSize,
  type Route,
  RouteService,
  SelectionService,
} from '@services';

/**
 * ViewModel виджета информационной панели
 */
@scope.transient()
export class InfoPanelModel {
  constructor(
    private readonly selectionService: SelectionService,
    private readonly routeService: RouteService,
    private readonly aircraftService: AircraftService,
  ) {}

  get selectedEntity() {
    return this.selectionService.selectedEntity;
  }

  clearSelection = (): void => {
    this.selectionService.clearSelection();
  };
  getDirectDistance = (route: Route): number => {
    return this.routeService.getDirectDistance(route);
  };
  createAircraft = (route: Route, type: AircraftSize): void => {
    this.aircraftService.createAircraft(route, type);
  };
}
