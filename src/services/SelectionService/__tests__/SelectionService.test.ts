import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { type Aircraft, AircraftDirection, AircraftSize } from '../../AircraftService/AircraftService.types';
import type { City } from '../../CityService/CityService.types';
import type { Route } from '../../RouteService/RouteService.types';
import { SelectionService } from '../SelectionService';
import { EntityTypeEnum } from '../SelectionService.types';

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

const createAircraft = (route: Route): Aircraft => ({
  id: 'aircraft-1',
  type: AircraftSize.medium,
  speed: 720,
  route,
  progress: 0.5,
  direction: AircraftDirection.forward,
});

describe('SelectionService', () => {
  it('инициализируется без выбранной сущности', () => {
    const service = new SelectionService();
    expect(service.selectedEntity).toBeNull();
  });

  it('selectCity устанавливает выбранный город', () => {
    const service = new SelectionService();
    const city = createCity('SVO');
    service.selectCity(city);
    expect(service.selectedEntity).not.toBeNull();
    expect(service.selectedEntity!.type).toBe(EntityTypeEnum.city);
    expect((service.selectedEntity as { data: City }).data).toStrictEqual(city);
  });

  it('selectRoute устанавливает выбранный маршрут', () => {
    const service = new SelectionService();
    const route = createRoute();
    service.selectRoute(route);
    expect(service.selectedEntity).not.toBeNull();
    expect(service.selectedEntity!.type).toBe(EntityTypeEnum.route);
    expect((service.selectedEntity as { data: Route }).data).toStrictEqual(route);
  });

  it('selectAircraft устанавливает выбранный самолёт', () => {
    const service = new SelectionService();
    const route = createRoute();
    const aircraft = createAircraft(route);
    service.selectAircraft(aircraft);
    expect(service.selectedEntity).not.toBeNull();
    expect(service.selectedEntity!.type).toBe(EntityTypeEnum.aircraft);
    expect((service.selectedEntity as { data: Aircraft }).data).toStrictEqual(aircraft);
  });

  it('selectChangelog устанавливает тип changelog', () => {
    const service = new SelectionService();
    service.selectChangelog();
    expect(service.selectedEntity).not.toBeNull();
    expect(service.selectedEntity!.type).toBe(EntityTypeEnum.changelog);
    expect((service.selectedEntity as { data: null }).data).toBeNull();
  });

  it('clearSelection сбрасывает выбор', () => {
    const service = new SelectionService();
    service.selectCity(createCity('SVO'));
    expect(service.selectedEntity).not.toBeNull();
    service.clearSelection();
    expect(service.selectedEntity).toBeNull();
  });
});
