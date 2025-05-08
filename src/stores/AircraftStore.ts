import { makeAutoObservable, makeObservable, observable, runInAction } from 'mobx'
import * as THREE from 'three'

import { ROUTE } from '../constants'
import { Aircraft, AircraftSize, Route } from '../types'
import { getArcPoints, positionToVector } from '../utils'

export class AircraftStore {
  aircrafts: Aircraft[] = []

  constructor() {
    makeAutoObservable(this)
  }

  createAircraft(route: Route, type: AircraftSize) {
    const aircraft = makeObservable({
      id: crypto.randomUUID(),
      type,
      route,
      position: { ...route.departureCity.position },
      progress: 0,
      speed: 0.5, // Скорость движения (0-1)
      direction: 'forward' as const, // Начинаем движение от departure к arrival
    }, {
      position: observable,
      progress: observable,
      speed: observable,
      direction: observable,
    })

    this.aircrafts.push(aircraft)
    route.aircrafts.push(aircraft)
    this.startMovement(aircraft)
  }

  private startMovement(aircraft: Aircraft) {
    const moveAircraft = () => {
      runInAction(() => {
        const speedStep = aircraft.speed / 100

        // Увеличиваем или уменьшаем прогресс в зависимости от направления
        if (aircraft.direction === 'forward') {
          aircraft.progress += speedStep
          // Проверяем, не превысили ли мы конечную точку
          if (aircraft.progress >= 1) {
            aircraft.progress = 1
            aircraft.direction = 'backward'
          }
        } else {
          aircraft.progress -= speedStep
          // Проверяем, не достигли ли мы начальной точки
          if (aircraft.progress <= 0) {
            aircraft.progress = 0
            aircraft.direction = 'forward'
          }
        }

        // Обновляем позицию самолета
        aircraft.position = this.getAircraftPosition(aircraft, aircraft.route)
      })

      requestAnimationFrame(moveAircraft)
    }

    requestAnimationFrame(moveAircraft)
  }

  getAircraftPosition(aircraft: Aircraft, route: Route) {
    const points = getArcPoints(
      positionToVector(route.departureCity.position),
      positionToVector(route.arrivalCity.position),
      ROUTE.SEGMENTS,
      ROUTE.ARC_HEIGHT,
    )

    // Обработка крайних точек
    if (aircraft.progress <= 0) return points[0]
    if (aircraft.progress >= 1) return points[points.length - 1]

    // Вычисляем индекс текущего сегмента
    const segmentCount = points.length - 1
    const segmentIndex = Math.floor(aircraft.progress * segmentCount)
    const segmentProgress = (aircraft.progress * segmentCount) % 1

    // Получаем точки текущего сегмента
    const startPoint = points[segmentIndex]
    const endPoint = points[segmentIndex + 1]

    // Интерполируем между точками сегмента
    return new THREE.Vector3().lerpVectors(startPoint, endPoint, segmentProgress)
  }
}
