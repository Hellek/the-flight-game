// Размеры и параметры глобуса
export const GLOBE_ROTATION = {
  X: Math.PI / 4,
  Y: Math.PI + (Math.PI / 18) * 3,
  Z: 0,
}

// Параметры маршрутов
export const ROUTE = {
  WIDTH: 5,
  SEGMENTS: 20,
  ARC_MAX_HEIGHT: 0.05, // Максимальная высота дуги маршрута (8-9 км)
  ARC_MIN_DISTANCE: 2, // Минимальное расстояние для максимальной высоты дуги
  ARC_MIN_HEIGHT: 0.005, // Минимальная высота дуги для близких точек
}

// Параметры городов
export const CITY = {
  SIZE: 0.005,
}

// Параметры самолетов
export const AIRCRAFT = {
  SIZE: 0.01,
}
