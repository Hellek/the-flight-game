import { makeAutoObservable } from 'mobx';
import { Route } from '../types/types';

export class RouteStore {
  routes: Route[] = [];
  selectedRoute: Route | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setRoutes(routes: Route[]) {
    this.routes = routes;
  }

  selectRoute(route: Route | null) {
    this.selectedRoute = route;
  }

  getRouteById(id: string) {
    return this.routes.find(route => route.id === id);
  }

  getRoutesByAirportId(airportId: string) {
    return this.routes.filter(route =>
      route.departureId === airportId || route.arrivalId === airportId
    );
  }
}
