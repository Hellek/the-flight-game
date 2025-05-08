import React from 'react'
import { observer } from 'mobx-react-lite'

import { type Route } from '../../types'
import { calculateDistance } from '../../utils'
import { CreateAircraft } from './CreateAircraft'
import { RouteAircrafts } from './RouteAircrafts'

interface RouteInfoProps {
  route: Route;
}

export const RouteInfo: React.FC<RouteInfoProps> = observer(({ route }) => {
  const { departureCity, arrivalCity } = route
  const distanceInKm = Math.round(calculateDistance(departureCity.position, arrivalCity.position))

  return (
    <>
      <div className="flex justify-between text-sm text-slate-600">
        <span>Пункты:</span>
        <span className="font-medium">{departureCity.name} - {arrivalCity.name}</span>
      </div>

      <div className="flex justify-between text-sm text-slate-600">
        <span>Расстояние:</span>
        <span className="font-medium">{distanceInKm} км</span>
      </div>

      <div className="pt-2 border-t border-slate-200">
        <RouteAircrafts route={route} />
      </div>

      <div className="pt-2 border-t border-slate-200">
        <CreateAircraft route={route} />
      </div>
    </>
  )
})
