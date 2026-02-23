import { makeAutoObservable } from 'mobx';
import { Props, scope } from '@core/di';
import { AircraftService, AircraftSize, type Route } from '@services';

export interface CreateAircraftModelProps {
  route: Route;
}

export interface SizeOption {
  value: AircraftSize;
  label: string;
}

@scope.transient()
export class CreateAircraftModel {
  selectedType = AircraftSize.small;

  constructor(
    private readonly props: Props<CreateAircraftModelProps>,
    private readonly aircraftService: AircraftService,
  ) {
    makeAutoObservable(this);
  }

  get route(): Route {
    return this.props.current.route;
  }

  get sizeOptions(): SizeOption[] {
    return Object.values(AircraftSize).map(size => ({
      value: size,
      label: this.aircraftService.getAircraftSizeName(size),
    }));
  }

  setSelectedType = (type: AircraftSize): void => {
    this.selectedType = type;
  };
  handleCreate = (): void => {
    this.aircraftService.createAircraft(this.route, this.selectedType);
  };
}
