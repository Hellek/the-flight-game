import { makeAutoObservable } from 'mobx';
import { DEBUG } from '@constants';
import { init, scope } from '@core/di';
import type { Cities, Routes } from '@services';
import { GameSettingsService } from '@services/GameSettingsService';
import { calculateDistance, convertToSphereCoordinates } from '@utils';
import { federalRussiaAirports } from '../dataCitiesList';

interface World {
  cities: Cities;
  routes: Routes;
}

/**
 * Модель виджета игры. Инкапсулирует генерацию предустановленного мира (города, маршруты).
 */
@scope.transient()
export class GameModel {
  private _world: World | null = null;

  constructor(readonly gameSettings: GameSettingsService) {
    makeAutoObservable(this);
  }

  get showRoutes() {
    return this.gameSettings.showRoutes;
  }

  [init]() {
    this.generateWorld();
  }

  private getPredefinedRoutes(cities: Cities): Routes {
    const routes: Routes = [];
    if (!DEBUG.ADD_PREDEFINED_ROUTES) return routes;

    const predefinedRoutes = [
      { departureCity: 'KZN', arrivalCity: 'BAX' },
      { departureCity: 'KZN', arrivalCity: 'LED' },
      { departureCity: 'KZN', arrivalCity: 'ESL' },
      { departureCity: 'MCX', arrivalCity: 'DYR' },
      { departureCity: 'MCX', arrivalCity: 'PKC' },
      { departureCity: 'VVO', arrivalCity: 'OVB' },
      { departureCity: 'VOZ', arrivalCity: 'LPK' },
      { departureCity: 'OMS', arrivalCity: 'SCL' },
      { departureCity: 'OMS', arrivalCity: 'KVX' },
      { departureCity: 'OMS', arrivalCity: 'PKV' },
    ];

    for (const route of predefinedRoutes) {
      const departureCity = cities.find(c => c.iata === route.departureCity);
      const arrivalCity = cities.find(c => c.iata === route.arrivalCity);
      if (departureCity && arrivalCity) {
        routes.push({
          id: `${departureCity.iata}-${arrivalCity.iata}`,
          departureCity,
          arrivalCity,
          aircrafts: [],
          distance: calculateDistance(departureCity.position, arrivalCity.position),
        });
      }
    }
    return routes;
  }

  private generateWorld() {
    const cities: Cities = federalRussiaAirports.map(city => ({
      iata: city.iata,
      name: city.name,
      position: convertToSphereCoordinates(city.lat, city.lon),
    }));

    const routes = this.getPredefinedRoutes(cities);
    this._world = { cities, routes };
  }

  get world() {
    return this._world;
  }
}
