import { DEBUG } from '@constants'
import { federalRussiaAirports } from '@data'
import type { City, Route, WorldInitials } from '@types'
import { calculateDistance } from '@utils/geometry'

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

  // Если дебаг отключен, возвращаем пустой массив маршрутов
  if (!DEBUG.ADD_PREDEFINED_ROUTES) {
    return routes
  }

  // Создаем маршруты между городами
  const predefinedRoutes = [
    { departureCity: 'KZN', arrivalCity: 'BAX' },
    { departureCity: 'KZN', arrivalCity: 'LED' },
    { departureCity: 'KZN', arrivalCity: 'ESL' },
    { departureCity: 'MCX', arrivalCity: 'DYR' },
    { departureCity: 'MCX', arrivalCity: 'PKC' },
    { departureCity: 'VVO', arrivalCity: 'OVB' },
    { departureCity: 'VOZ', arrivalCity: 'LPK' },
    { departureCity: 'OMS', arrivalCity: 'SCL' },
    { departureCity: 'OMS', arrivalCity: 'KVX' },
    { departureCity: 'OMS', arrivalCity: 'PKV' },
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
  const cities: City[] = federalRussiaAirports.map(city => {
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
