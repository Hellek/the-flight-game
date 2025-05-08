import { makeAutoObservable } from 'mobx'

import { Route } from '../types'

export class RouteStore {
  routes: Route[] = []
  selectedRoute: Route | null = null

  constructor(routes: Route[]) {
    this.routes = routes
    makeAutoObservable(this)
  }

  selectRoute(route: Route | null) {
    this.selectedRoute = route
  }
}
