import * as THREE from 'three'

import { Position } from '../types'

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

export const getArcPoints = (
  start: THREE.Vector3,
  end: THREE.Vector3,
  segments: number = 20,
  arcHeight: number = 0.3,
): THREE.Vector3[] => {
  const points: THREE.Vector3[] = []
  const arcCurvenessCoefficient = 0.25

  // Находим центр дуги
  const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)

  for (let i = 0; i <= segments; i++) {
    const t = i / segments

    // Интерполируем между начальной и конечной точками
    const point = new THREE.Vector3().lerpVectors(start, end, t)

    // Добавляем высоту дуги
    const height = Math.sin(t * Math.PI) * arcHeight * arcCurvenessCoefficient
    point.add(center.clone().multiplyScalar(height))

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
