import { AircraftStore } from '@stores/AircraftStore'
import { CityStore } from '@stores/CityStore'
import { FinanceStore } from '@stores/FinanceStore'
import { RouteStore } from '@stores/RouteStore'
import { SelectionStore } from '@stores/SelectionStore'
import { ViewSettingsStore } from '@stores/ViewSettingsStore'
import type { WorldInitials } from '@types'
import { generateWorld } from '@utils'

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
