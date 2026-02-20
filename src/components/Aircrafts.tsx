import { observer } from 'mobx-react-lite'
import type { Route } from '../types'
import { Aircraft } from './Aircraft'

interface AircraftsProps {
  route: Route;
}

export const Aircrafts = observer(({ route }: AircraftsProps) => {
  return (
    <>
      {route.aircrafts.map(aircraft => (
        <Aircraft
          key={aircraft.id}
          aircraft={aircraft}
        />
      ))}
    </>
  )
})
