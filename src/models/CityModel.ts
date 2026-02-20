import { makeAutoObservable } from 'mobx'
import type { City } from '@types'

export class CityModel {
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
