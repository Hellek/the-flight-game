import { citiesRussia } from '../data'
import { City, Route, WorldInitials } from '../types'
import { calculateDistance } from './geometry'

/**
 * Преобразует географические координаты в 3D координаты на сфере
 */
const convertToSphereCoordinates = (lat: number, lon: number) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  return {
    x: -Math.sin(phi) * Math.cos(theta),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta),
  }
}

const getPredefinedRoutes = (cities: City[]): Route[] => {
  const routes: Route[] = []

  // Создаем маршруты между городами
  const predefinedRoutes = [
    { departureCity: 'KZN', arrivalCity: 'BAX' },
    { departureCity: 'KZN', arrivalCity: 'LED' },
    { departureCity: 'VVO', arrivalCity: 'OVB' },
  ]

  for (const route of predefinedRoutes) {
    const departureCity = cities.find(city => city.iata === route.departureCity)
    const arrivalCity = cities.find(city => city.iata === route.arrivalCity)

    if (departureCity && arrivalCity) {
      routes.push({
        id: `${departureCity.iata}-${arrivalCity.iata}`,
        departureCity,
        arrivalCity,
        aircrafts: [],
        distance: calculateDistance(departureCity.position, arrivalCity.position),
      })
    }
  }

  return routes
}

/**
 * Генерирует игровой мир с реальными аэропортами России
 */
export const generateWorld = (): WorldInitials => {
  // Создаем города из всех доступных данных
  const cities: City[] = citiesRussia.map(city => {
    return {
      iata: city.iata,
      name: city.name,
      position: convertToSphereCoordinates(city.lat, city.lon),
    }
  })

  // Создаем маршруты между городами
  const routes: Route[] = getPredefinedRoutes(cities)

  return {
    cities,
    routes,
  }
}
