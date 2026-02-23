import { makeAutoObservable } from 'mobx';
import { Props, scope } from '@core/di';
import { type Aircraft, AircraftDirection, AircraftService } from '@services';

export interface AircraftInfoModelProps {
  aircraft: Aircraft;
}

/**
 * ViewModel виджета информации о воздушном судне
 */
@scope.transient()
export class AircraftInfoModel {
  constructor(
    private readonly props: Props<AircraftInfoModelProps>,
    private readonly aircraftService: AircraftService,
  ) {
    makeAutoObservable(this);
  }

  get aircraft(): Aircraft {
    return this.props.current.aircraft;
  }

  get progressPercent(): number {
    const { direction, progress } = this.aircraft;

    return direction === AircraftDirection.forward
      ? Math.round(progress * 100)
      : 100 - Math.round(progress * 100);
  }

  get flight(): string {
    const { route, direction } = this.aircraft;

    return direction === AircraftDirection.forward
      ? `${route.departureCity.name} → ${route.arrivalCity.name}`
      : `${route.arrivalCity.name} → ${route.departureCity.name}`;
  }

  get aircraftName(): string {
    return this.aircraftService.getAircraftSizeName(this.aircraft.type);
  }

  get routeDistance(): string {
    const { distance } = this.aircraft.route;

    if (distance < 1000) {
      return `${Math.round(distance)} км`;
    }
    return `${(distance / 1000).toFixed(1)} тыс. км`;
  }

  get speed(): number {
    return this.aircraft.speed;
  }
}
