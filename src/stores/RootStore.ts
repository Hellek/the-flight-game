import type { WorldInitials } from '../types'
import { generateWorld } from '../utils'
import { AircraftStore } from './AircraftStore'
import { CityStore } from './CityStore'
import { FinanceStore } from './FinanceStore'
import { RouteStore } from './RouteStore'
import { SelectionStore } from './SelectionStore'
import { ViewSettingsStore } from './ViewSettingsStore'

export class RootStore {
  city: CityStore
  route: RouteStore
  selection: SelectionStore
  aircraft: AircraftStore
  finance: FinanceStore
  viewSettings: ViewSettingsStore

  constructor(world: WorldInitials) {
    this.city = new CityStore(world.cities)
    this.route = new RouteStore(world.routes)
    this.selection = new SelectionStore()
    this.aircraft = new AircraftStore(this.route)
    this.finance = new FinanceStore()
    this.viewSettings = new ViewSettingsStore()
  }
}

export const rootStore = new RootStore(generateWorld())
