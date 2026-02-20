import * as THREE from 'three'
import { ROUTE } from '@constants'
import type { Position } from '@types'

export const positionToVector = (position: Position): THREE.Vector3 => {
  return new THREE.Vector3(position.x, position.y, position.z)
}

export const calculateDistance = (pos1: Position, pos2: Position): number => {
  // Преобразуем декартовы координаты в сферические
  const lat1 = Math.asin(pos1.y)
  const lon1 = Math.atan2(pos1.z, pos1.x)
  const lat2 = Math.asin(pos2.y)
  const lon2 = Math.atan2(pos2.z, pos2.x)

  // Радиус Земли в километрах
  const earthRadiusKm = 6371

  // Формула гаверсинусов
  const dLat = lat2 - lat1
  const dLon = lon2 - lon1

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusKm * c
}

/**
 * Вычисляет количество сегментов для маршрута на основе его длины
 * @param distanceKm - расстояние маршрута в километрах
 * @returns количество сегментов
 */
export const calculateSegments = (distanceKm: number): number => {
  const { SEGMENT_LENGTH_KM, MIN_SEGMENTS } = ROUTE

  // Вычисляем количество сегментов: делим расстояние на длину одного сегмента
  const segments = Math.ceil(distanceKm / SEGMENT_LENGTH_KM)

  // Возвращаем максимум из вычисленного количества и минимального
  return Math.max(segments, MIN_SEGMENTS)
}

export const getArcPoints = (
  start: THREE.Vector3,
  end: THREE.Vector3,
  segments?: number,
): THREE.Vector3[] => {
  // Если количество сегментов не указано, вычисляем его на основе расстояния
  if (segments === undefined) {
    // Вычисляем расстояние в километрах используя сферические координаты
    const pos1 = { x: start.x, y: start.y, z: start.z }
    const pos2 = { x: end.x, y: end.y, z: end.z }
    const distanceKm = calculateDistance(pos1, pos2)
    segments = calculateSegments(distanceKm)
  }

  const points: THREE.Vector3[] = []

  // Вычисляем расстояние между точками
  const distance = start.distanceTo(end)

  // Вычисляем высоту дуги в зависимости от расстояния
  const getArcHeight = (): number => {
    const { ARC_MAX_HEIGHT, ARC_MIN_HEIGHT, ARC_MIN_DISTANCE } = ROUTE

    // Если расстояние меньше минимального, используем пропорциональную высоту
    if (distance < ARC_MIN_DISTANCE) {
      // Линейная интерполяция между минимальной и максимальной высотой
      return ARC_MIN_HEIGHT + (distance / ARC_MIN_DISTANCE) * (ARC_MAX_HEIGHT - ARC_MIN_HEIGHT)
    }

    // Для больших расстояний используем максимальную высоту
    return ARC_MAX_HEIGHT
  }

  const arcHeight = getArcHeight()

  // Создаем точки маршрута
  for (let i = 0; i <= segments; i++) {
    const progress = i / segments

    // Базовое положение точки на сфере
    const point = new THREE.Vector3().lerpVectors(start, end, progress)

    // Нормализуем вектор, чтобы получить точку на поверхности сферы
    point.normalize()

    // Вычисляем высоту дуги используя синусоиду
    const height = Math.sin(progress * Math.PI) * arcHeight

    // Двигаем точку по нормали к поверхности сферы
    point.multiplyScalar(1 + height)

    points.push(point)
  }

  return points
}

export const formatDistance = (distance: number): string => {
  if (distance < 1000) {
    return `${Math.round(distance)} км`
  }
  return `${(distance / 1000).toFixed(1)} тыс. км`
}
