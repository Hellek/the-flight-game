import { World, Airport, Route } from '../types/types';
import { airportsRussia } from '../data/airports';

/**
 * Генерирует игровой мир с реальными аэропортами России
 */
export const generateWorld = (): World => {
  // Фиксированные границы карты для России
  const MAP_BOUNDS = {
    minLat: 35,  // Южная граница
    maxLat: 75,  // Северная граница
    minLon: 15,  // Западная граница
    maxLon: 200  // Восточная граница
  };

  // Создаем аэропорты из всех доступных данных
  const airports: Airport[] = airportsRussia
    // Фильтруем аэропорты, которые находятся в пределах карты
    .filter(airport =>
      airport.latitude >= MAP_BOUNDS.minLat &&
      airport.latitude <= MAP_BOUNDS.maxLat &&
      airport.longitude >= MAP_BOUNDS.minLon &&
      airport.longitude <= MAP_BOUNDS.maxLon
    )
    .map(airport => ({
      id: airport.iata,
      name: airport.iata,
      city: airport.city,
      position: {
        // Нормализуем координаты в пределах заданных границ
        x: ((airport.longitude - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * 1000,
        // Инвертируем Y координату, чтобы север был вверху
        y: (1 - (airport.latitude - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 800
      }
    }));

  // Создаем маршруты между всеми аэропортами
  const routes: Route[] = [];
  // Некоторые маршруты для тестирования
  const testRoutes = [['NSK', 'BTK'], ['GDX', 'DYR'], ['PES', 'MMK']]
  for (let i = 0; i < testRoutes.length; i++) {
    const [departure, arrival] = testRoutes[i];
    const departureAirport = airports.find(airport => airport.id === departure);
    const arrivalAirport = airports.find(airport => airport.id === arrival);

    if (departureAirport && arrivalAirport) {
      routes.push({
        id: `route-${departureAirport.id}-${arrivalAirport.id}`,
        departureAirport: departureAirport,
        arrivalAirport: arrivalAirport,
        aircrafts: [],
      });
    }
  }

  return {
    airports,
    routes,
    size: {
      width: 1000,
      height: 800
    },
    scale: 1 // Масштаб теперь не используется, так как координаты уже нормализованы
  };
};
