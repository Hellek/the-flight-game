import { makeAutoObservable, makeObservable, observable, runInAction } from 'mobx';
import { Aircraft, AircraftSize, Position, Route } from '../types/types';

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
        const currentPosition = this.calculateAircraftPosition(
          aircraft.route.departureAirport.position,
          aircraft.route.arrivalAirport.position,
          aircraft.progress
        );

        aircraft.position = currentPosition;
      });

      requestAnimationFrame(moveAircraft);
    };

    requestAnimationFrame(moveAircraft);
  }

  private calculateAircraftPosition(
    start: Position,
    end: Position,
    progress: number
  ): Position {
    // Рассчитываем базовую позицию на прямой
    const x = start.x + (end.x - start.x) * progress;
    const y = start.y + (end.y - start.y) * progress;

    // Добавляем дугу для более реалистичного движения
    const distance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
    const arcHeight = distance * 0.2; // Высота дуги
    const arcProgress = Math.sin(progress * Math.PI);
    const arcOffset = arcHeight * arcProgress;

    return {
      x,
      y: y - arcOffset,
    };
  }
}
