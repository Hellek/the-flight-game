import { World, Airport } from '../types/types';

// Список реальных аэропортов для генерации
const AIRPORTS_DATA = [
  { name: 'Шереметьево', id: 'SVO' },
  { name: 'Домодедово', id: 'DME' },
  { name: 'Внуково', id: 'VKO' },
  { name: 'Пулково', id: 'LED' },
  { name: 'Толмачёво', id: 'OVB' },
  { name: 'Кольцово', id: 'SVX' },
  { name: 'Хабаровск', id: 'KHV' },
  { name: 'Владивосток', id: 'VVO' },
  { name: 'Казань', id: 'KZN' },
  { name: 'Сочи', id: 'AER' },
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
        { id: airportData.id, name: airportData.name, position },
        world.airports,
        minDistanceBetweenAirports
      ) &&
      attempts < maxAttempts
    );

    if (attempts < maxAttempts) {
      world.airports.push({
        id: airportData.id,
        name: airportData.name,
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
  return {
    airports: [
      {
        id: 'SVO',
        name: 'Шереметьево',
        position: { x: 100, y: 100 },
      },
      {
        id: 'DME',
        name: 'Домодедово',
        position: { x: 300, y: 300 },
      },
      {
        id: 'VKO',
        name: 'Внуково',
        position: { x: 500, y: 500 },
      },
    ],
    size: {
      width: 1000,
      height: 1000,
    },
    scale: 10,
  };
};
