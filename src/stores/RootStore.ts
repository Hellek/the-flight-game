import { WorldInitials } from '../types'
import { generateWorld } from '../utils'
import { AircraftStore } from './AircraftStore'
import { CityStore } from './CityStore'
import { FinanceStore } from './FinanceStore'
import { RouteStore } from './RouteStore'
import { SelectionStore } from './SelectionStore'

export class RootStore {
  city: CityStore
  route: RouteStore
  selection: SelectionStore
  aircraft: AircraftStore
  finance: FinanceStore

  constructor(world: WorldInitials) {
    this.city = new CityStore(world.cities)
    this.route = new RouteStore(world.routes)
    this.selection = new SelectionStore()
    this.aircraft = new AircraftStore()
    this.finance = new FinanceStore()
  }
}

export const rootStore = new RootStore(generateWorld())
