import { observer } from 'mobx-react-lite'
import { CreateAircraft } from '@components/info-panel/CreateAircraft'
import { RouteAircrafts } from '@components/info-panel/RouteAircrafts'
import { rootStore } from '@stores'
import type { Route } from '@types'

interface RouteInfoProps {
  route: Route;
}

export const RouteInfo = observer(({ route }: RouteInfoProps) => {
  const { departureCity, arrivalCity } = route
  const distanceInKm = Math.round(rootStore.route.getDirectDistance(route))

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
