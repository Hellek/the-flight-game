import { init, Props, scope } from '@core/di';
import { GameSettingsPlugin } from '@plugins';
import {
  EntityTypeEnum,
  type Route,
  type Routes,
  RouteService,
  SelectionService,
} from '@services';

export interface RoutesModelProps {
  routes: Routes;
}

/**
 * Виджет маршрутов
 */
@scope.transient()
export class RoutesModel {
  constructor(
    public readonly props: Props<RoutesModelProps>,
    private readonly routeService: RouteService,
    private readonly selectionService: SelectionService,
    private readonly gameSettingsPlugin: GameSettingsPlugin,
  ) { }

  [init](props: RoutesModelProps): void {
    this.routeService.initialSet(props.routes);
  }

  get routes(): Route[] {
    return this.routeService.routes;
  }

  getRoutePoints = (route: Route) => {
    return this.routeService.getRoutePoints(route);
  };

  get selectedRoute(): Route | null {
    const { selectedEntity } = this.selectionService;
    return selectedEntity?.type === EntityTypeEnum.route ? selectedEntity.data : null;
  }

  selectRoute = (route: Route): void => {
    this.selectionService.selectRoute(route);
  };

  get globeInitialRotation() {
    return this.gameSettingsPlugin.globeInitialRotation;
  }
}
