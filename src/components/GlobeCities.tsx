import { observer } from 'mobx-react-lite'
import { City } from '@components/city'
import { GLOBE_ROTATION } from '@constants'
import { rootModel } from '@models'

export const GlobeCities = observer(() => {
  const { cities } = rootModel.city

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
