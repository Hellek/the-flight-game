import { Props, scope } from '@core/di';
import { type Route, RouteService } from '@services';

export interface RouteInfoModelProps {
  route: Route;
}

/**
 * ViewModel виджета информации о маршруте
 */
@scope.transient()
export class RouteInfoModel {
  constructor(
    private readonly props: Props<RouteInfoModelProps>,
    private readonly routeService: RouteService,
  ) { }

  get route(): Route {
    return this.props.current.route;
  }

  get departureCity() {
    return this.route.departureCity;
  }

  get arrivalCity() {
    return this.route.arrivalCity;
  }

  get distanceInKm(): number {
    return Math.round(this.routeService.getDirectDistance(this.route));
  }
}
