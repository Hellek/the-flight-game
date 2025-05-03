import { World, Airport, Route } from '../types/types';

// Список реальных аэропортов для генерации
const AIRPORTS_DATA = [
  { name: 'Шереметьево', id: 'SVO', city: 'Москва' },
  { name: 'Домодедово', id: 'DME', city: 'Москва' },
  { name: 'Внуково', id: 'VKO', city: 'Москва' },
  { name: 'Пулково', id: 'LED', city: 'Санкт-Петербург' },
  { name: 'Толмачёво', id: 'OVB', city: 'Новосибирск' },
  { name: 'Кольцово', id: 'SVX', city: 'Екатеринбург' },
  { name: 'Хабаровск', id: 'KHV', city: 'Хабаровск' },
  { name: 'Владивосток', id: 'VVO', city: 'Владивосток' },
  { name: 'Казань', id: 'KZN', city: 'Казань' },
  { name: 'Сочи', id: 'AER', city: 'Сочи' },
];

/**
 * Генерирует случайное число в заданном диапазоне
 */
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Генерирует случайные координаты для аэропорта
 */
const generateAirportPosition = (worldSize: { width: number; height: number }): { x: number; y: number } => {
  return {
    x: getRandomNumber(0, worldSize.width),
    y: getRandomNumber(0, worldSize.height),
  };
};

/**
 * Проверяет, не слишком ли близко расположены аэропорты друг к другу
 */
const isAirportTooClose = (
  newAirport: Airport,
  existingAirports: Airport[],
  minDistance: number
): boolean => {
  return existingAirports.some((airport) => {
    const dx = airport.position.x - newAirport.position.x;
    const dy = airport.position.y - newAirport.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < minDistance;
  });
};

/**
 * Генерирует новый игровой мир
 */
export const generateWorld = (
  width: number = 1000,
  height: number = 1000,
  scale: number = 10,
  minAirports: number = 5,
  maxAirports: number = 10,
  minDistanceBetweenAirports: number = 100
): World => {
  const world: World = {
    airports: [],
    routes: [],
    size: { width, height },
    scale,
  };

  // Определяем количество аэропортов
  const airportCount = getRandomNumber(minAirports, maxAirports);

  // Создаем аэропорты
  for (let i = 0; i < airportCount; i++) {
    const airportData = AIRPORTS_DATA[i % AIRPORTS_DATA.length];
    let position;
    let attempts = 0;
    const maxAttempts = 100;

    // Пытаемся найти подходящее место для аэропорта
    do {
      position = generateAirportPosition(world.size);
      attempts++;
    } while (
      isAirportTooClose(
        {
          id: airportData.id,
          name: airportData.name,
          city: airportData.city,
          position
        },
        world.airports,
        minDistanceBetweenAirports
      ) &&
      attempts < maxAttempts
    );

    if (attempts < maxAttempts) {
      world.airports.push({
        id: airportData.id,
        name: airportData.name,
        city: airportData.city,
        position,
      });
    }
  }

  return world;
};

/**
 * Генерирует тестовый мир с фиксированным расположением аэропортов
 */
export const generateTestWorld = (): World => {
  const airports: Airport[] = [
    {
      id: 'airport-1',
      name: 'Шереметьево',
      city: 'Москва',
      position: { x: 200, y: 200 }
    },
    {
      id: 'airport-2',
      name: 'Пулково',
      city: 'Санкт-Петербург',
      position: { x: 150, y: 150 }
    },
    {
      id: 'airport-3',
      name: 'Толмачёво',
      city: 'Новосибирск',
      position: { x: 500, y: 300 }
    },
    {
      id: 'airport-4',
      name: 'Кольцово',
      city: 'Екатеринбург',
      position: { x: 450, y: 200 }
    },
    {
      id: 'airport-5',
      name: 'Хабаровск',
      city: 'Хабаровск',
      position: { x: 800, y: 200 }
    }
  ];

  const routes: Route[] = [
    {
      id: 'route-1',
      departureId: 'airport-1',
      arrivalId: 'airport-2'
    },
    {
      id: 'route-2',
      departureId: 'airport-1',
      arrivalId: 'airport-3'
    },
    {
      id: 'route-3',
      departureId: 'airport-2',
      arrivalId: 'airport-4'
    },
    {
      id: 'route-4',
      departureId: 'airport-3',
      arrivalId: 'airport-5'
    },
    {
      id: 'route-5',
      departureId: 'airport-4',
      arrivalId: 'airport-5'
    }
  ];

  return {
    airports,
    routes,
    size: {
      width: 1000,
      height: 800
    },
    scale: 100 // 100 километров на единицу координат
  };
};
