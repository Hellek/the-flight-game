import React from 'react'
import { observer } from 'mobx-react-lite'

import { type Route } from '../types'
import { Aircraft } from './Aircraft'

interface AircraftsProps {
  route: Route;
}

export const Aircrafts: React.FC<AircraftsProps> = observer(({ route }) => {
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
