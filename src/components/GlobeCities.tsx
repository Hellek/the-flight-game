import React from 'react'
import { observer } from 'mobx-react-lite'
import { GLOBE_ROTATION } from '../constants'
import { rootStore } from '../stores'
import { City } from './city'

export const GlobeCities: React.FC = observer(() => {
  const { cities } = rootStore.city

  return (
    <group rotation={[GLOBE_ROTATION.X, GLOBE_ROTATION.Y, GLOBE_ROTATION.Z]}>
      {cities.map((city, index) => (
        <City
          key={index}
          city={city}
        />
      ))}
    </group>
  )
})
