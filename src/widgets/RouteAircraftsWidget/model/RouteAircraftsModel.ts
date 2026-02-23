import { makeAutoObservable } from 'mobx';
import { Props, scope } from '@core/di';
import { AircraftService, type AircraftSize, type Route } from '@services';

export interface RouteAircraftsModelProps {
  route: Route;
}

@scope.transient()
export class RouteAircraftsModel {
  constructor(
    private readonly props: Props<RouteAircraftsModelProps>,
    private readonly aircraftService: AircraftService,
  ) {
    makeAutoObservable(this);
  }

  get aircrafts() {
    return this.props.current.route.aircrafts;
  }

  readonly getAircraftSizeName = (size: AircraftSize): string => {
    return this.aircraftService.getAircraftSizeName(size);
  };
}
