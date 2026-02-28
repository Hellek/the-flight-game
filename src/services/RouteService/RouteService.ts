import { makeAutoObservable } from 'mobx';
import { Vector3 } from 'three';
import { scope } from '@core/di';
import { GeometryPlugin } from '@plugins';
import type { Route, Routes } from './RouteService.types';

@scope.singleton()
export class RouteService {
  routes: Routes = [];
  selectedRoute: Route | null = null;
  private readonly routePointsCache = new Map<string, Vector3[]>();
  private readonly routeDistanceCache = new Map<string, number>();
  private readonly directDistanceCache = new Map<string, number>();
  private initialized = false;
  /**
   * Параметры маршрута
   */
  readonly routeParams = {
    /**
     * Длина одного сегмента в километрах
     */
    segmentLengthKm: 100,
    /**
     * Минимальное количество сегментов для коротких маршрутов
     */
    minSegments: 8,
    /**
     * Максимальная высота дуги маршрута (8-9 км)
     */
    arcMaxHeight: 0.05,
    /**
     * Минимальное расстояние для максимальной высоты дуги
     */
    arcMinDistance: 2,
    /**
     * Минимальная высота дуги для близких точек
     */
    arcMinHeight: 0.005,
  };

  constructor(private readonly geometry: GeometryPlugin) {
    makeAutoObservable(this);
  }

  initialSet(routes: Routes): void {
    if (this.initialized) return;
    this.initialized = true;
    this.routes = routes;
  }

  addRoute(route: Route): void {
    this.routes.push(route);
  }

  getPreviewPoints(start: Vector3, end: Vector3, cameraPosition?: Vector3): Vector3[] {
    return this.getArcPoints(start, end, undefined, cameraPosition);
  }

  selectRoute(route: Route | null) {
    this.selectedRoute = route;
  }

  /**
   * Вычисляет количество сегментов для маршрута на основе его длины
   * @param distanceKm - расстояние маршрута в километрах
   * @returns количество сегментов
   */
  private readonly calculateSegments = (distanceKm: number): number => {
    const { segmentLengthKm, minSegments } = this.routeParams;

    // Вычисляем количество сегментов: делим расстояние на длину одного сегмента
    const segments = Math.ceil(distanceKm / segmentLengthKm);

    // Возвращаем максимум из вычисленного количества и минимального
    return Math.max(segments, minSegments);
  };
  private readonly getArcPoints = (
    start: Vector3,
    end: Vector3,
    segments?: number,
    cameraPosition?: Vector3,
  ): Vector3[] => {
    if (segments === undefined) {
      const distanceKm = this.geometry.calculateDistance(start, end);
      segments = this.calculateSegments(distanceKm);
    }

    const distance = start.distanceTo(end);

    const { arcMaxHeight, arcMinHeight, arcMinDistance } = this.routeParams;

    const arcHeight =
      distance < arcMinDistance
        ? arcMinHeight + (distance / arcMinDistance) * (arcMaxHeight - arcMinHeight)
        : arcMaxHeight;

    const sum = start.clone().add(end);

    const useLongArc =
      cameraPosition !== undefined &&
      sum.lengthSq() > 1e-10 &&
      sum.normalize().dot(cameraPosition.clone().normalize()) < 0;

    const mid = useLongArc ? sum.clone().multiplyScalar(-1) : null;

    const points: Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const progress = i / segments;

      const point =
        mid !== null
          ? progress <= 0.5
            ? new Vector3().lerpVectors(start, mid, progress * 2)
            : new Vector3().lerpVectors(mid, end, (progress - 0.5) * 2)
          : new Vector3().lerpVectors(start, end, progress);

      point.normalize();
      point.multiplyScalar(1 + Math.sin(progress * Math.PI) * arcHeight);
      points.push(point);
    }

    return points;
  };

  getRoutePoints(route: Route): Vector3[] {
    const cacheKey = `${route.departureCity.iata}-${route.arrivalCity.iata}`;

    if (!this.routePointsCache.has(cacheKey)) {
      const segments = this.calculateSegments(route.distance);

      const points = this.getArcPoints(
        route.departureCity.position,
        route.arrivalCity.position,
        segments,
      );

      this.routePointsCache.set(cacheKey, points);
    }

    return this.routePointsCache.get(cacheKey)!;
  }

  calculateRouteDistance(route: Route): number {
    const cacheKey = `${route.departureCity.iata}-${route.arrivalCity.iata}`;

    if (!this.routeDistanceCache.has(cacheKey)) {
      const points = this.getRoutePoints(route);

      let totalDistance = 0;
      for (let i = 1; i < points.length; i++) {
        totalDistance += points[i].distanceTo(points[i - 1]);
      }

      this.routeDistanceCache.set(cacheKey, totalDistance);
    }

    return this.routeDistanceCache.get(cacheKey)!;
  }

  getDirectDistance(route: Route): number {
    const cacheKey = `${route.departureCity.iata}-${route.arrivalCity.iata}`;

    if (!this.directDistanceCache.has(cacheKey)) {
      const distance = this.geometry.calculateDistance(route.departureCity.position, route.arrivalCity.position);
      this.directDistanceCache.set(cacheKey, distance);
    }

    return this.directDistanceCache.get(cacheKey)!;
  }
}
