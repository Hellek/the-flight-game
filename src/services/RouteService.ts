import { makeAutoObservable } from 'mobx';
import { Vector3 } from 'three';
import { scope } from '@core/di';
import { GeometryPlugin } from '@plugins';
import type { Route, Routes } from './types';

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
  ): Vector3[] => {
    // Если количество сегментов не указано, вычисляем его на основе расстояния
    if (segments === undefined) {
      const distanceKm = this.geometry.calculateDistance(start, end);
      segments = this.calculateSegments(distanceKm);
    }

    const points: Vector3[] = [];

    // Вычисляем расстояние между точками
    const distance = start.distanceTo(end);

    // Вычисляем высоту дуги в зависимости от расстояния
    const getArcHeight = (): number => {
      const { arcMaxHeight, arcMinHeight, arcMinDistance } = this.routeParams;

      // Если расстояние меньше минимального, используем пропорциональную высоту
      if (distance < arcMinDistance) {
        // Линейная интерполяция между минимальной и максимальной высотой
        return arcMinHeight + (distance / arcMinDistance) * (arcMaxHeight - arcMinHeight);
      }

      // Для больших расстояний используем максимальную высоту
      return arcMaxHeight;
    };

    const arcHeight = getArcHeight();

    // Создаем точки маршрута
    for (let i = 0; i <= segments; i++) {
      const progress = i / segments;

      // Базовое положение точки на сфере
      const point = new Vector3().lerpVectors(start, end, progress);

      // Нормализуем вектор, чтобы получить точку на поверхности сферы
      point.normalize();

      // Вычисляем высоту дуги используя синусоиду
      const height = Math.sin(progress * Math.PI) * arcHeight;

      // Двигаем точку по нормали к поверхности сферы
      point.multiplyScalar(1 + height);

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
