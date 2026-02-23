import {
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import { Euler, Matrix4, Vector3 } from 'three';
import { scope } from '@core/di';
import { GameSettingsPlugin } from '@plugins';
import {
  Aircraft,
  AircraftDirection,
  Aircrafts,
  AircraftSize,
  AircraftSpeed,
} from './AircraftService.types';
import { RouteService } from './RouteService';
import type { Route } from './RouteService.types';

@scope.singleton()
export class AircraftService {
  aircrafts: Aircrafts = [];
  private lastUpdateTime: number = 0;
  private animationId: number | null = null;

  constructor(
    private readonly routeService: RouteService,
    private readonly gameSettingsPlugin: GameSettingsPlugin,
  ) {
    makeAutoObservable(this);
  }

  createAircraft(route: Route, type: AircraftSize) {
    const aircraft = makeObservable(
      {
        id: crypto.randomUUID(),
        type,
        route,
        progress: 0,
        speed: AircraftSpeed[type],
        direction: AircraftDirection.forward,
      },
      {
        progress: observable,
        speed: observable,
        direction: observable,
      },
    );

    this.aircrafts.push(aircraft);
    route.aircrafts.push(aircraft);

    if (this.aircrafts.length === 1) {
      this.startAnimation();
    }
  }

  removeAircraft(aircraftId: string) {
    const index = this.aircrafts.findIndex(a => a.id === aircraftId);
    if (index !== -1) {
      const aircraft = this.aircrafts[index];
      const routeIndex = aircraft.route.aircrafts.findIndex(a => a.id === aircraftId);
      if (routeIndex !== -1) {
        aircraft.route.aircrafts.splice(routeIndex, 1);
      }

      this.aircrafts.splice(index, 1);

      if (this.aircrafts.length === 0) {
        this.stopAnimation();
      }
    }
  }

  private startAnimation() {
    const { timeAccelerationFactor } = this.gameSettingsPlugin;

    const animate = (timestamp: number) => {
      if (!this.lastUpdateTime) this.lastUpdateTime = timestamp;
      const deltaTime = (timestamp - this.lastUpdateTime) / 1000;
      this.lastUpdateTime = timestamp;

      runInAction(() => {
        this.aircrafts.forEach(aircraft => {
          const distanceTraveled =
            (aircraft.speed * deltaTime * timeAccelerationFactor) / 3600;

          const routeDistance = aircraft.route.distance;
          const progressStep = distanceTraveled / routeDistance;

          if (aircraft.direction === AircraftDirection.forward) {
            aircraft.progress = Math.min(1, aircraft.progress + progressStep);
            if (aircraft.progress >= 1) {
              aircraft.progress = 1;
              aircraft.direction = AircraftDirection.backward;
            }
          } else {
            aircraft.progress = Math.max(0, aircraft.progress - progressStep);
            if (aircraft.progress <= 0) {
              aircraft.progress = 0;
              aircraft.direction = AircraftDirection.forward;
            }
          }
        });
      });

      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  private stopAnimation() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  getAircraftPosition(aircraft: Aircraft) {
    const points = this.routeService.getRoutePoints(aircraft.route);

    if (aircraft.progress <= 0) return points[0];
    if (aircraft.progress >= 1) return points[points.length - 1];

    const segmentCount = points.length - 1;
    const segmentIndex = Math.floor(aircraft.progress * segmentCount);
    const segmentProgress = (aircraft.progress * segmentCount) % 1;

    const startPoint = points[segmentIndex];
    const endPoint = points[segmentIndex + 1];

    return new Vector3().lerpVectors(startPoint, endPoint, segmentProgress);
  }

  getAircraftRotation(aircraft: Aircraft): [number, number, number] {
    const currentPoint = this.getAircraftPosition(aircraft);
    const routePoints = this.routeService.getRoutePoints(aircraft.route);

    const segmentCount = routePoints.length - 1;
    const segmentIndex = Math.floor(aircraft.progress * segmentCount);

    let targetPoint: Vector3;
    if (aircraft.direction === AircraftDirection.forward) {
      targetPoint = routePoints[Math.min(segmentIndex + 1, segmentCount)];
    } else {
      targetPoint = routePoints[Math.max(segmentIndex, 0)];
    }

    const direction = new Vector3().subVectors(targetPoint, currentPoint).normalize();
    const sphereNormal = currentPoint.clone().normalize();

    const axisZ = direction.clone();

    const axisY = new Vector3();
    axisY.copy(sphereNormal);
    const projection = axisY.dot(axisZ);
    axisY.sub(axisZ.clone().multiplyScalar(projection));
    axisY.normalize();

    const axisX = new Vector3().crossVectors(axisY, axisZ).normalize();
    axisZ.crossVectors(axisX, axisY).normalize();

    const rotationMatrix = new Matrix4();
    rotationMatrix.makeBasis(axisX, axisY, axisZ);

    const targetRotation = new Euler();
    targetRotation.setFromRotationMatrix(rotationMatrix);

    return [targetRotation.x, targetRotation.y, targetRotation.z];
  }
}
