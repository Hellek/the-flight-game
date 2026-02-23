import { Vector3 } from 'three';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import type { Aircraft } from '../../AircraftService/AircraftService.types';
import type { City } from '../../CityService/CityService.types';
import { RouteService } from '../RouteService';
import type { Route, Routes } from '../RouteService.types';

const createMockGeometry = () => ({ calculateDistance: vi.fn((_a: Vector3, _b: Vector3) => 1000) });

const createCity = (iata: string, position: Vector3): City => ({
  name: iata,
  iata,
  position,
});

const createRoute = (dep: City, arr: City, distance: number): Route => ({
  id: `${dep.iata}-${arr.iata}`,
  departureCity: dep,
  arrivalCity: arr,
  aircrafts: [] as Aircraft[],
  distance,
});

describe('RouteService', () => {
  it('инициализируется с пустыми маршрутами и без выбранного', () => {
    const geometry = createMockGeometry();
    const service = new RouteService(geometry as never);
    expect(service.routes).toEqual([]);
    expect(service.selectedRoute).toBeNull();
  });

  it('initialSet устанавливает маршруты только при первом вызове', () => {
    const geometry = createMockGeometry();
    const service = new RouteService(geometry as never);
    const dep = createCity('SVO', new Vector3(1, 0, 0));
    const arr = createCity('LHR', new Vector3(0, 1, 0));
    const routes: Routes = [createRoute(dep, arr, 2500)];

    service.initialSet(routes);
    expect(service.routes).toHaveLength(1);
    expect(service.routes[0].id).toBe('SVO-LHR');

    service.initialSet([...routes, createRoute(arr, dep, 2500)]);
    expect(service.routes).toHaveLength(1);
  });

  it('selectRoute устанавливает выбранный маршрут', () => {
    const geometry = createMockGeometry();
    const service = new RouteService(geometry as never);
    const dep = createCity('A', new Vector3(0, 0, 0));
    const arr = createCity('B', new Vector3(1, 0, 0));
    const route = createRoute(dep, arr, 100);

    service.selectRoute(route);
    expect(service.selectedRoute).toStrictEqual(route);
    service.selectRoute(null);
    expect(service.selectedRoute).toBeNull();
  });

  it('getRoutePoints возвращает точки и кэширует по ключу маршрута', () => {
    const geometry = createMockGeometry();
    const service = new RouteService(geometry as never);
    const dep = createCity('SVO', new Vector3(1, 0, 0));
    const arr = createCity('LHR', new Vector3(0, 1, 0));
    const route = createRoute(dep, arr, 500);

    const points1 = service.getRoutePoints(route);
    const points2 = service.getRoutePoints(route);
    expect(points1).toBe(points2);
    expect(points1.length).toBeGreaterThan(1);
    expect(points1[0]).toBeInstanceOf(Vector3);
  });

  it('getDirectDistance использует geometry и кэширует результат', () => {
    const geometry = createMockGeometry();
    const service = new RouteService(geometry as never);
    const dep = createCity('A', new Vector3(0, 0, 0));
    const arr = createCity('B', new Vector3(1, 0, 0));
    const route = createRoute(dep, arr, 100);

    const d1 = service.getDirectDistance(route);
    const d2 = service.getDirectDistance(route);
    expect(geometry.calculateDistance).toHaveBeenCalledWith(dep.position, arr.position);
    expect(d1).toBe(1000);
    expect(d2).toBe(1000);
  });

  it('calculateRouteDistance возвращает длину по точкам дуги', () => {
    const geometry = createMockGeometry();
    const service = new RouteService(geometry as never);
    const dep = createCity('A', new Vector3(1, 0, 0));
    const arr = createCity('B', new Vector3(0, 1, 0));
    const route = createRoute(dep, arr, 500);

    const distance = service.calculateRouteDistance(route);
    expect(distance).toBeGreaterThan(0);
    const again = service.calculateRouteDistance(route);
    expect(again).toBe(distance);
  });
});
