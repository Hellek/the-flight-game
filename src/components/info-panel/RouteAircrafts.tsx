import { observer } from 'mobx-react-lite'
import type { Route } from '../../types'
import { getAircraftSizeName } from '../../utils'
import { Heading } from '../ui'

interface RouteAircraftsProps {
  route: Route
}

export const RouteAircrafts = observer(({ route }: RouteAircraftsProps) => {
  const { aircrafts } = route
  return (
    <div className="space-y-2">
      <Heading level={4} className="text-sm font-medium text-slate-700">Самолеты на маршруте</Heading>

      {aircrafts.length > 0 ? (
        <div className="space-y-2">
          {aircrafts.map(aircraft => (
            <div key={aircraft.id} className="flex items-center justify-between text-sm">
              <span>{getAircraftSizeName(aircraft.type)}</span>
              <span className="text-slate-500">{aircraft.speed} км/ч</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-500">Нет самолетов на маршруте</div>
      )}
    </div>
  )
})
