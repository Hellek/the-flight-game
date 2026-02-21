import { makeAutoObservable } from 'mobx';
import type * as THREE from 'three';
import { scope } from '@core/di';
import { calculateDistance, calculateSegments, getArcPoints, positionToVector } from '@utils';
import type { Route, Routes } from './types';

@scope.singleton()
export class RouteService {
  routes: Routes = [];
  selectedRoute: Route | null = null;
  private readonly routePointsCache = new Map<string, THREE.Vector3[]>();
  private readonly routeDistanceCache = new Map<string, number>();
  private readonly directDistanceCache = new Map<string, number>();
  private initialized = false;

  constructor() {
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

  getRoutePoints(route: Route): THREE.Vector3[] {
    const cacheKey = `${route.departureCity.iata}-${route.arrivalCity.iata}`;

    if (!this.routePointsCache.has(cacheKey)) {
      const segments = calculateSegments(route.distance);

      const points = getArcPoints(
        positionToVector(route.departureCity.position),
        positionToVector(route.arrivalCity.position),
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
      const distance = calculateDistance(route.departureCity.position, route.arrivalCity.position);
      this.directDistanceCache.set(cacheKey, distance);
    }

    return this.directDistanceCache.get(cacheKey)!;
  }
}
