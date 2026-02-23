import { Vector3 } from 'three';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import type { City } from '../../CityService/CityService.types';
import type { Route } from '../../RouteService/RouteService.types';
import { AircraftService } from '../AircraftService';
import { type Aircraft, AircraftDirection, AircraftSize } from '../AircraftService.types';

const createCity = (iata: string): City => ({
  name: iata,
  iata,
  position: new Vector3(1, 0, 0),
});

const createRoute = (): Route => ({
  id: 'SVO-LHR',
  departureCity: createCity('SVO'),
  arrivalCity: createCity('LHR'),
  aircrafts: [],
  distance: 2500,
});

const createMockRouteService = () => ({
  getRoutePoints: vi.fn((_route: Route) => [
    new Vector3(0, 0, 0),
    new Vector3(0.5, 0.5, 0),
    new Vector3(1, 1, 1),
  ]),
});

const createMockGameSettings = () => ({ timeAccelerationFactor: 1200 });

describe('AircraftService', () => {
  it('инициализируется с пустым списком самолётов', () => {
    const routeService = createMockRouteService();
    const gameSettings = createMockGameSettings();
    const service = new AircraftService(routeService as never, gameSettings as never);
    expect(service.aircrafts).toEqual([]);
  });

  it('createAircraft добавляет самолёт в список и в маршрут', () => {
    const routeService = createMockRouteService();
    const gameSettings = createMockGameSettings();
    const service = new AircraftService(routeService as never, gameSettings as never);
    const route = createRoute();

    service.createAircraft(route, AircraftSize.medium);

    expect(service.aircrafts).toHaveLength(1);
    expect(route.aircrafts).toHaveLength(1);
    const aircraft = service.aircrafts[0] as Aircraft;
    expect(aircraft.type).toBe(AircraftSize.medium);
    expect(aircraft.progress).toBe(0);
    expect(aircraft.direction).toBe(AircraftDirection.forward);
  });

  it('removeAircraft удаляет самолёт по id', () => {
    const routeService = createMockRouteService();
    const gameSettings = createMockGameSettings();
    const service = new AircraftService(routeService as never, gameSettings as never);
    const route = createRoute();
    service.createAircraft(route, AircraftSize.small);
    const id = service.aircrafts[0]!.id;

    service.removeAircraft(id);

    expect(service.aircrafts).toHaveLength(0);
    expect(route.aircrafts).toHaveLength(0);
  });

  it('removeAircraft с неизвестным id не меняет список', () => {
    const routeService = createMockRouteService();
    const gameSettings = createMockGameSettings();
    const service = new AircraftService(routeService as never, gameSettings as never);
    const route = createRoute();
    service.createAircraft(route, AircraftSize.small);

    service.removeAircraft('unknown-id');

    expect(service.aircrafts).toHaveLength(1);
  });

  it('getAircraftPosition при progress 0 возвращает первую точку', () => {
    const routeService = createMockRouteService();
    const points = [new Vector3(1, 2, 3), new Vector3(4, 5, 6)];
    routeService.getRoutePoints.mockReturnValue(points);
    const gameSettings = createMockGameSettings();
    const service = new AircraftService(routeService as never, gameSettings as never);
    const route = createRoute();
    service.createAircraft(route, AircraftSize.large);
    const aircraft = service.aircrafts[0]!;
    aircraft.progress = 0;

    const pos = service.getAircraftPosition(aircraft);

    expect(pos).toEqual(points[0]);
  });

  it('getAircraftPosition при progress 1 возвращает последнюю точку', () => {
    const routeService = createMockRouteService();
    const points = [new Vector3(1, 2, 3), new Vector3(4, 5, 6)];
    routeService.getRoutePoints.mockReturnValue(points);
    const gameSettings = createMockGameSettings();
    const service = new AircraftService(routeService as never, gameSettings as never);
    const route = createRoute();
    service.createAircraft(route, AircraftSize.large);
    const aircraft = service.aircrafts[0]!;
    aircraft.progress = 1;

    const pos = service.getAircraftPosition(aircraft);

    expect(pos).toEqual(points[points.length - 1]);
  });

  it('getAircraftRotation возвращает кортеж из трёх чисел', () => {
    const routeService = createMockRouteService();
    const gameSettings = createMockGameSettings();
    const service = new AircraftService(routeService as never, gameSettings as never);
    const route = createRoute();
    service.createAircraft(route, AircraftSize.medium);
    const aircraft = service.aircrafts[0]!;
    aircraft.progress = 0.5;

    const rotation = service.getAircraftRotation(aircraft);

    expect(rotation).toHaveLength(3);
    expect(rotation[0]).toBeDefined();
    expect(rotation[1]).toBeDefined();
    expect(rotation[2]).toBeDefined();
  });
});
