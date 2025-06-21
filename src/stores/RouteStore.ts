import { makeAutoObservable } from 'mobx'
import * as THREE from 'three'

import { ROUTE } from '../constants'
import { Route } from '../types'
import { calculateDistance, getArcPoints, positionToVector } from '../utils'

export class RouteStore {
  routes: Route[] = []
  selectedRoute: Route | null = null
  private routePointsCache = new Map<string, THREE.Vector3[]>()
  private routeDistanceCache = new Map<string, number>()
  private directDistanceCache = new Map<string, number>()

  constructor(routes: Route[]) {
    this.routes = routes
    makeAutoObservable(this)
  }

  selectRoute(route: Route | null) {
    this.selectedRoute = route
  }

  getRoutePoints(route: Route): THREE.Vector3[] {
    const cacheKey = `${route.departureCity.iata}-${route.arrivalCity.iata}`

    if (!this.routePointsCache.has(cacheKey)) {
      const points = getArcPoints(
        positionToVector(route.departureCity.position),
        positionToVector(route.arrivalCity.position),
        ROUTE.SEGMENTS,
      )
      this.routePointsCache.set(cacheKey, points)
    }

    return this.routePointsCache.get(cacheKey)!
  }

  calculateRouteDistance(route: Route): number {
    const cacheKey = `${route.departureCity.iata}-${route.arrivalCity.iata}`

    if (!this.routeDistanceCache.has(cacheKey)) {
      const points = this.getRoutePoints(route)

      let totalDistance = 0
      for (let i = 1; i < points.length; i++) {
        totalDistance += points[i].distanceTo(points[i - 1])
      }

      this.routeDistanceCache.set(cacheKey, totalDistance)
    }

    return this.routeDistanceCache.get(cacheKey)!
  }

  getDirectDistance(route: Route): number {
    const cacheKey = `${route.departureCity.iata}-${route.arrivalCity.iata}`

    if (!this.directDistanceCache.has(cacheKey)) {
      const distance = calculateDistance(route.departureCity.position, route.arrivalCity.position)
      this.directDistanceCache.set(cacheKey, distance)
    }

    return this.directDistanceCache.get(cacheKey)!
  }
}
