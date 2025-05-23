import { makeAutoObservable } from 'mobx'

export class ViewSettingsStore {
  showRoutes: boolean = true

  constructor() {
    makeAutoObservable(this)
  }

  toggleRoutes() {
    this.showRoutes = !this.showRoutes
  }
}
