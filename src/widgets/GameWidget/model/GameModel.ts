import { makeAutoObservable } from 'mobx';
import { init, scope } from '@core/di';
import { GameSettingsPlugin, GeometryPlugin } from '@plugins';
import {
  type Cities,
  CityService,
  type Routes,
  RouteService,
} from '@services';
import { federalRussiaAirports } from '../dataCitiesList';

/**
 * Модель виджета игры. Инкапсулирует генерацию предустановленного мира (города, маршруты).
 */
@scope.transient()
export class GameModel {
  constructor(
    private readonly gameSettings: GameSettingsPlugin,
    private readonly geometry: GeometryPlugin,
    private readonly cityService: CityService,
    private readonly routeService: RouteService,
  ) {
    makeAutoObservable(this);
  }

  get globeInitialRotation() {
    return this.geometry.globeInitialRotation;
  }

  [init]() {
    this.generateWorld();
  }

  private getPredefinedRoutes(cities: Cities): Routes {
    const routes: Routes = [];

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
          distance: this.geometry.calculateDistance(departureCity.position, arrivalCity.position),
        });
      }
    }
    return routes;
  }

  private generateWorld() {
    const cities: Cities = federalRussiaAirports.map(city => ({
      iata: city.iata,
      name: city.name,
      position: this.geometry.latLonToVector3(city.lat, city.lon),
    }));

    const routes: Routes = this.gameSettings.isProdEnv ? [] : this.getPredefinedRoutes(cities);
    this.cityService.setCities(cities);
    this.routeService.initialSet(routes);
  }
}
