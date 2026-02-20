import { makeAutoObservable, makeObservable, observable, runInAction } from 'mobx'
import * as THREE from 'three'
import { AircraftSpeed, TIME_ACCELERATION_FACTOR } from '@constants'
import type { RouteStore } from '@stores/RouteStore'
import { type Aircraft, AircraftDirection, type AircraftSize, type Route } from '@types'

export class AircraftStore {
  aircrafts: Aircraft[] = []
  private routeStore: RouteStore
  private lastUpdateTime: number = 0
  private animationId: number | null = null

  constructor(routeStore: RouteStore) {
    this.routeStore = routeStore
    makeAutoObservable(this)
  }

  createAircraft(route: Route, type: AircraftSize) {
    const aircraft = makeObservable({
      id: crypto.randomUUID(),
      type,
      route,
      progress: 0,
      speed: AircraftSpeed[type],
      direction: AircraftDirection.forward,
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

  removeAircraft(aircraftId: string) {
    const index = this.aircrafts.findIndex(a => a.id === aircraftId)
    if (index !== -1) {
      const aircraft = this.aircrafts[index]
      // Удаляем из маршрута
      const routeIndex = aircraft.route.aircrafts.findIndex(a => a.id === aircraftId)
      if (routeIndex !== -1) {
        aircraft.route.aircrafts.splice(routeIndex, 1)
      }

      // Удаляем из списка самолётов
      this.aircrafts.splice(index, 1)

      // Останавливаем анимацию, если самолётов не осталось
      if (this.aircrafts.length === 0) {
        this.stopAnimation()
      }
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
          // Вычисляем пройденное расстояние в км с учётом ускорения времени
          const distanceTraveled = (aircraft.speed * deltaTime * TIME_ACCELERATION_FACTOR) / 3600 // км/ч -> км/сек с ускорением

          // Вычисляем прогресс на основе пройденного расстояния
          const routeDistance = aircraft.route.distance // общее расстояние маршрута в км
          const progressStep = distanceTraveled / routeDistance

          if (aircraft.direction === AircraftDirection.forward) {
            aircraft.progress = Math.min(1, aircraft.progress + progressStep)
            if (aircraft.progress >= 1) {
              aircraft.progress = 1
              aircraft.direction = AircraftDirection.backward
            }
          } else {
            aircraft.progress = Math.max(0, aircraft.progress - progressStep)
            if (aircraft.progress <= 0) {
              aircraft.progress = 0
              aircraft.direction = AircraftDirection.forward
            }
          }
        })
      })

      this.animationId = requestAnimationFrame(animate)
    }

    this.animationId = requestAnimationFrame(animate)
  }

  private stopAnimation() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  getAircraftPosition(aircraft: Aircraft) {
    const points = this.routeStore.getRoutePoints(aircraft.route)

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

  getAircraftRotation(aircraft: Aircraft): [number, number, number] {
    const currentPoint = this.getAircraftPosition(aircraft)
    const routePoints = this.routeStore.getRoutePoints(aircraft.route)

    // Вычисляем индекс текущего сегмента
    const segmentCount = routePoints.length - 1
    const segmentIndex = Math.floor(aircraft.progress * segmentCount)

    // Получаем целевую точку в зависимости от направления движения
    let targetPoint: THREE.Vector3
    if (aircraft.direction === AircraftDirection.forward) {
      targetPoint = routePoints[Math.min(segmentIndex + 1, segmentCount)]
    } else {
      targetPoint = routePoints[Math.max(segmentIndex, 0)]
    }

    // Вычисляем направление движения (вектор от текущей точки к целевой)
    const direction = new THREE.Vector3().subVectors(targetPoint, currentPoint).normalize()

    // Вычисляем нормаль к поверхности сферы (вектор от центра к точке самолёта)
    const sphereNormal = currentPoint.clone().normalize()

    // Создаем ортогональную систему координат
    // Ось Z - направление движения (следует дуге маршрута)
    const axisZ = direction.clone()

    // Ось Y - проекция нормали сферы на плоскость, перпендикулярную направлению движения
    // Это обеспечивает, что "низ" самолёта всегда направлен к центру планеты
    const axisY = new THREE.Vector3()
    axisY.copy(sphereNormal)
    // Проектируем нормаль на плоскость, перпендикулярную направлению движения
    const projection = axisY.dot(axisZ)
    axisY.sub(axisZ.clone().multiplyScalar(projection))
    axisY.normalize()

    // Ось X - перпендикуляр к Y и Z
    const axisX = new THREE.Vector3().crossVectors(axisY, axisZ).normalize()

    // Корректируем ось Z, чтобы система была ортогональной
    axisZ.crossVectors(axisX, axisY).normalize()

    // Создаем матрицу поворота
    const rotationMatrix = new THREE.Matrix4()
    rotationMatrix.makeBasis(axisX, axisY, axisZ)

    // Получаем углы Эйлера из матрицы
    const targetRotation = new THREE.Euler()
    targetRotation.setFromRotationMatrix(rotationMatrix)

    return [targetRotation.x, targetRotation.y, targetRotation.z]
  }
}
