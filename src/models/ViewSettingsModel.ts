import { makeAutoObservable } from 'mobx'

export class ViewSettingsModel {
  showRoutes: boolean = true

  constructor() {
    makeAutoObservable(this)
  }

  toggleRoutes() {
    this.showRoutes = !this.showRoutes
  }
}
