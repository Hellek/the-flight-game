import { makeAutoObservable, makeObservable, observable, runInAction } from 'mobx'
import * as THREE from 'three'

import { Aircraft, AircraftSize, Route } from '../types'
import { RouteStore } from './RouteStore'
import { AIRCRAFT } from '../constants/globe'

export class AircraftStore {
  aircrafts: Aircraft[] = []
  private routeStore: RouteStore
  private lastUpdateTime: number = 0
  private animationId: number | null = null

  constructor(routeStore: RouteStore) {
    this.routeStore = routeStore
    makeAutoObservable(this)
  }

  private getAircraftSpeedMultiplier(type: AircraftSize): number {
    // Разные скорости для разных типов самолётов
    // TODO: добавить реальные скорости самолётов
    const speedMultipliers = {
      small: 1.0,    // Базовая скорость
      medium: 1.05,   // На 5% быстрее
      large: 1.08,    // На 8% быстрее
      xlarge: 1.1,   // На 10% быстрее
      xxlarge: 1.12,  // На 12% быстрее
    }

    return speedMultipliers[type] || 1.0
  }

  createAircraft(route: Route, type: AircraftSize) {
    const aircraft = makeObservable({
      id: crypto.randomUUID(),
      type,
      route,
      progress: 0,
      speed: AIRCRAFT.SPEED * this.getAircraftSpeedMultiplier(type), // Финальная скорость с учётом типа самолёта
      direction: 'forward' as const,
    }, {
      progress: observable,
      speed: observable,
      direction: observable,
    })

    this.aircrafts.push(aircraft)
    route.aircrafts.push(aircraft)

    // Запускаем анимацию, если это первый самолёт
    if (this.aircrafts.length === 1) {
      this.startAnimation()
    }
  }

  private startAnimation() {
    const animate = (timestamp: number) => {
      if (!this.lastUpdateTime) this.lastUpdateTime = timestamp
      const deltaTime = (timestamp - this.lastUpdateTime) / 1000 // в секундах
      this.lastUpdateTime = timestamp

      runInAction(() => {
        // Обновляем все самолёты
        this.aircrafts.forEach(aircraft => {
          // Вычисляем скорость, пропорциональную реальному расстоянию маршрута
          const speedStep = (aircraft.speed / aircraft.route.distance) * deltaTime * 1000

          if (aircraft.direction === 'forward') {
            aircraft.progress = Math.min(1, aircraft.progress + speedStep)
            if (aircraft.progress >= 1) {
              aircraft.progress = 1
              aircraft.direction = 'backward'
            }
          } else {
            aircraft.progress = Math.max(0, aircraft.progress - speedStep)
            if (aircraft.progress <= 0) {
              aircraft.progress = 0
              aircraft.direction = 'forward'
            }
          }
        })
      })

      this.animationId = requestAnimationFrame(animate)
    }

    this.animationId = requestAnimationFrame(animate)
  }

  getAircraftPosition(aircraft: Aircraft, route: Route) {
    const points = this.routeStore.getRoutePoints(route)

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

  getAircraftRotation(aircraft: Aircraft, route: Route): [number, number, number] {
    const currentPoint = this.getAircraftPosition(aircraft, route)
    const nextPoint = this.getNextPoint(aircraft, route)

    // Создаем временный объект для вычисления поворота
    const tempObject = new THREE.Object3D()
    tempObject.position.copy(currentPoint)

    // Устанавливаем направление на следующую точку
    tempObject.lookAt(nextPoint)

    // Получаем углы поворота
    const targetRotation = new THREE.Euler()
    targetRotation.copy(tempObject.rotation)

    // Учитываем направление движения (вперёд/назад)
    if (aircraft.direction === 'backward') {
      targetRotation.y += Math.PI // Разворачиваем на 180 градусов
    }

    return [targetRotation.x, targetRotation.y, targetRotation.z]
  }

  private getNextPoint(aircraft: Aircraft, route: Route): THREE.Vector3 {
    const routePoints = this.routeStore.getRoutePoints(route)

    // Вычисляем следующую точку для определения направления
    const nextPointIndex = Math.min(
      Math.floor(aircraft.progress * (routePoints.length - 1)) + 1,
      routePoints.length - 1,
    )

    return routePoints[nextPointIndex]
  }
}
