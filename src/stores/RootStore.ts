import { World } from '../types'
import { generateWorld } from '../utils'
import { AircraftStore } from './AircraftStore'
import { CityStore } from './CityStore'
import { RouteStore } from './RouteStore'
import { SelectionStore } from './SelectionStore'
import { WorldStore } from './WorldStore'

export class RootStore {
  cityStore: CityStore
  routeStore: RouteStore
  selectionStore: SelectionStore
  worldStore: WorldStore
  aircraftStore: AircraftStore

  constructor(world: World) {
    this.worldStore = new WorldStore(world)
    this.cityStore = new CityStore(world.cities)
    this.routeStore = new RouteStore(world.routes)
    this.aircraftStore = new AircraftStore()
    this.selectionStore = new SelectionStore()
  }
}

export const rootStore = new RootStore(generateWorld())
