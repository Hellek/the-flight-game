import { makeAutoObservable } from 'mobx';
import { scope } from '@core/di';
import { GameSettingsPlugin, GeometryPlugin } from '@plugins';
import {
  type Route,
  RouteService,
  SelectedEntityType,
  SelectionService,
} from '@services';

/**
 * Виджет маршрутов
 */
@scope.transient()
export class RoutesModel {
  hoveredRouteId: string | null = null;

  constructor(
    private readonly routeService: RouteService,
    private readonly selectionService: SelectionService,
    private readonly gameSettingsPlugin: GameSettingsPlugin,
    private readonly geometry: GeometryPlugin,
  ) {
    makeAutoObservable(this);
  }

  setHoveredRoute = (routeId: string | null): void => {
    this.hoveredRouteId = routeId;
  };

  get routes(): Route[] {
    return this.routeService.routes;
  }

  getRoutePoints = (route: Route) => {
    return this.routeService.getRoutePoints(route);
  };

  get selectedRoute(): Route | null {
    const { selectedEntity } = this.selectionService;
    return selectedEntity?.type === SelectedEntityType.route ? selectedEntity.data : null;
  }

  selectRoute = (route: Route): void => {
    this.selectionService.selectRoute(route);
  };

  get globeInitialRotation() {
    return this.geometry.globeInitialRotation;
  }

  get routesVisible(): boolean {
    return this.gameSettingsPlugin.routesVisible;
  }
}
