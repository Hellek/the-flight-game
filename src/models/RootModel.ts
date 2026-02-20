import { AircraftModel } from '@models/AircraftModel'
import { CityModel } from '@models/CityModel'
import { FinanceModel } from '@models/FinanceModel'
import { RouteModel } from '@models/RouteModel'
import { SelectionModel } from '@models/SelectionModel'
import { ViewSettingsModel } from '@models/ViewSettingsModel'
import type { WorldInitials } from '@types'
import { generateWorld } from '@utils'

export class RootModel {
  city: CityModel
  route: RouteModel
  selection: SelectionModel
  aircraft: AircraftModel
  finance: FinanceModel
  viewSettings: ViewSettingsModel

  constructor(world: WorldInitials) {
    this.city = new CityModel(world.cities)
    this.route = new RouteModel(world.routes)
    this.selection = new SelectionModel()
    this.aircraft = new AircraftModel(this.route)
    this.finance = new FinanceModel()
    this.viewSettings = new ViewSettingsModel()
  }
}

export const rootModel = new RootModel(generateWorld())
