import { observer } from 'mobx-react-lite'
import type { Aircraft } from '../../types'
import { formatDistance, getAircraftSizeName } from '../../utils'

interface AircraftInfoProps {
  aircraft: Aircraft
}

export const AircraftInfo = observer(({ aircraft }: AircraftInfoProps) => {
  const { route, progress, speed } = aircraft

  const progressPercent = aircraft.direction === 'forward'
    ? Math.round(progress * 100)
    : 100 - Math.round(progress * 100)

  const flight = aircraft.direction === 'forward'
    ? `${route.departureCity.name} → ${route.arrivalCity.name}`
    : `${route.arrivalCity.name} → ${route.departureCity.name}`

  return (
    <>
      <div className="flex justify-between text-sm text-slate-600">
        <span>Тип:</span>
        <span className="font-medium">{getAircraftSizeName(aircraft.type)}</span>
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Маршрут:</span>
        <span className="font-medium">{flight}</span>
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Прогресс:</span>
        <span className="font-medium">{progressPercent}%</span>
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Расстояние:</span>
        <span className="font-medium">{formatDistance(route.distance)}</span>
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Скорость:</span>
        <span className="font-medium">{speed} км/ч</span>
      </div>
    </>
  )
})
