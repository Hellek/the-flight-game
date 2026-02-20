import { observer } from 'mobx-react-lite'
import { Aircrafts } from '@components/Aircrafts'
import { GLOBE_ROTATION } from '@constants'
import { rootStore } from '@stores'

export const GlobeAircrafts = observer(() => {
  const { routes } = rootStore.route

  return (
    <group rotation={[GLOBE_ROTATION.X, GLOBE_ROTATION.Y, GLOBE_ROTATION.Z]}>
      {routes.map(route => (
        <Aircrafts key={`aircrafts-${route.id}`} route={route} />
      ))}
    </group>
  )
})
