import { makeAutoObservable } from 'mobx'
import { City } from '../types'

export class CityStore {
  cities: City[] = []
  selectedCity: City | null = null

  constructor(cities: City[]) {
    this.cities = cities
    makeAutoObservable(this)
  }

  selectCity(city: City | null) {
    this.selectedCity = city
  }
}
