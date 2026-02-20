import { observer } from 'mobx-react-lite'
import { Aircraft } from '@components/Aircraft'
import type { Route } from '@types'

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
