import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { CityService } from '../CityService';
import type { Cities, City } from '../CityService.types';

describe('CityService', () => {
  it('инициализируется с пустым списком городов', () => {
    const service = new CityService();
    expect(service.cities).toEqual([]);
  });

  it('setCities устанавливает список городов', () => {
    const service = new CityService();

    const cities: Cities = [
      { name: 'Moscow', iata: 'SVO', position: new Vector3(1, 0, 0) },
      { name: 'London', iata: 'LHR', position: new Vector3(0, 1, 0) },
    ];

    service.setCities(cities);
    expect(service.cities).toHaveLength(2);
    expect(service.cities[0].name).toBe('Moscow');
    expect(service.cities[1].iata).toBe('LHR');
  });

  it('допускает повторный вызов setCities', () => {
    const service = new CityService();
    const first: City = { name: 'A', iata: 'A', position: new Vector3(0, 0, 0) };
    service.setCities([first]);
    expect(service.cities).toHaveLength(1);

    const second: City = { name: 'B', iata: 'B', position: new Vector3(1, 1, 1) };
    service.setCities([first, second]);
    expect(service.cities).toHaveLength(2);
  });
});
