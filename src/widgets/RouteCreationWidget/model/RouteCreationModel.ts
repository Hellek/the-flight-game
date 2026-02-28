import { makeAutoObservable } from 'mobx';
import { Euler, Quaternion, Vector3 } from 'three';
import { destroy, init, scope } from '@core/di';
import { GeometryPlugin } from '@plugins';
import {
  type City,
  type Route,
  RouteService,
  UserEventsService,
} from '@services';

function isCityContext(ctx: unknown): ctx is { city: City } {
  return typeof ctx === 'object' && ctx !== null && 'city' in ctx;
}

function isPointContext(ctx: unknown): ctx is { point: Vector3 } {
  return typeof ctx === 'object' && ctx !== null && 'point' in ctx;
}

@scope.transient()
export class RouteCreationModel {
  isDragging = false;
  startCity: City | null = null;
  targetCity: City | null = null;
  currentEndPosition: Vector3 | null = null;
  private unsubscribeDrag: (() => void) | null = null;
  private unsubscribeLongPress: (() => void) | null = null;

  constructor(
    private readonly userEventsService: UserEventsService,
    private readonly routeService: RouteService,
    private readonly geometry: GeometryPlugin,
  ) {
    makeAutoObservable(this);
  }

  [init](): void {
    this.unsubscribeDrag = this.userEventsService.subscribeToDrag(
      (phase, _event, context) => {
        if (phase === 'start' && isCityContext(context)) {
          this.startDrag(context.city);
        } else if (phase === 'move') {
          if (isPointContext(context)) {
            this.updateEndPosition(context.point);
          } else if (isCityContext(context)) {
            this.updateTarget(context.city);
          } else if (context === null) {
            this.updateTarget(null);
          }
        } else if (phase === 'end') {
          this.endDrag();
        }
      },
    );

    this.unsubscribeLongPress = this.userEventsService.subscribeToLongPress(
      (_event, context) => {
        if (isCityContext(context)) {
          this.startDrag(context.city);
        }
      },
    );
  }

  [destroy](): void {
    this.unsubscribeDrag?.();
    this.unsubscribeLongPress?.();
  }

  startDrag = (city: City): void => {
    this.isDragging = true;
    this.startCity = city;
    this.targetCity = null;
    this.currentEndPosition = city.position.clone();
  };
  updateTarget = (city: City | null): void => {
    this.targetCity = city;
  };
  updateEndPosition = (position: Vector3): void => {
    this.currentEndPosition = position.clone();
  };
  endDrag = (): void => {
    if (this.isDragging && this.startCity && this.targetCity && this.startCity.iata !== this.targetCity.iata) {
      this.addRoute(this.startCity, this.targetCity);
    }

    this.isDragging = false;
    this.startCity = null;
    this.targetCity = null;
    this.currentEndPosition = null;
  };
  addRoute = (departureCity: City, arrivalCity: City): void => {
    const exists = this.routeService.routes.some(
      r =>
        r.departureCity.iata === departureCity.iata && r.arrivalCity.iata === arrivalCity.iata,
    );

    if (exists) return;

    const route: Route = {
      id: `${departureCity.iata}-${arrivalCity.iata}`,
      departureCity,
      arrivalCity,
      aircrafts: [],
      distance: this.geometry.calculateDistance(departureCity.position, arrivalCity.position),
    };

    this.routeService.addRoute(route);
  };
  getPreviewPoints = (cameraPositionWorld?: Vector3): Vector3[] => {
    if (!this.isDragging || !this.startCity || !this.currentEndPosition) return [];
    const end = this.targetCity?.position ?? this.currentEndPosition;
    const [rx, ry, rz] = this.geometry.globeInitialRotation;
    const invQuat = new Quaternion().setFromEuler(new Euler(rx, ry, rz)).invert();

    const cameraPositionLocal = cameraPositionWorld
      ? cameraPositionWorld.clone().applyQuaternion(invQuat)
      : undefined;

    return this.routeService.getPreviewPoints(
      this.startCity.position,
      end,
      cameraPositionLocal,
    );
  };
}
