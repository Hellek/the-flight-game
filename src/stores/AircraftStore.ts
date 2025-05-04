import { makeAutoObservable, makeObservable, observable, runInAction } from 'mobx';
import { Aircraft, AircraftSize, Position, Route } from '../types/types';
import { calculateArcPosition } from '../utils/arcUtils';

export class AircraftStore {
  aircrafts: Aircraft[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  createAircraft(route: Route, type: AircraftSize) {
    const aircraft = makeObservable({
      id: crypto.randomUUID(),
      type,
      route,
      position: { ...route.departureAirport.position },
      progress: 0,
      speed: 0.5, // Скорость движения (0-1)
      direction: 'forward' as const, // Начинаем движение от departure к arrival
    }, {
      position: observable,
      progress: observable,
      speed: observable,
      direction: observable
    });

    this.aircrafts.push(aircraft);
    route.aircrafts.push(aircraft);
    this.startMovement(aircraft);
  }

  private startMovement(aircraft: Aircraft) {
    const moveAircraft = () => {
      runInAction(() => {
        // Увеличиваем или уменьшаем прогресс в зависимости от направления
        if (aircraft.direction === 'forward') {
          aircraft.progress += aircraft.speed / 100;
        } else {
          aircraft.progress -= aircraft.speed / 100;
        }

        // Если достигли конечной точки, меняем направление
        if (aircraft.progress >= 1) {
          aircraft.progress = 1;
          aircraft.direction = 'backward';
        } else if (aircraft.progress <= 0) {
          aircraft.progress = 0;
          aircraft.direction = 'forward';
        }

        // Рассчитываем текущую позицию на маршруте
        aircraft.position = calculateArcPosition(
          aircraft.route.departureAirport.position,
          aircraft.route.arrivalAirport.position,
          aircraft.progress
        );
      });

      requestAnimationFrame(moveAircraft);
    };

    requestAnimationFrame(moveAircraft);
  }
}
