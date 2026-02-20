import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { GLOBE_ROTATION, itemColor, itemColorHovered, itemColorSelected, ROUTE } from '@constants'
import { rootModel } from '@models'
import { Line } from '@react-three/drei'

export const GlobeRoutes = observer(() => {
  const { routes } = rootModel.route
  const { selectedEntity } = rootModel.selection
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null)

  return (
    <group rotation={[GLOBE_ROTATION.X, GLOBE_ROTATION.Y, GLOBE_ROTATION.Z]}>
      {routes.map(route => {
        const points = rootModel.route.getRoutePoints(route)

        const isSelected = selectedEntity?.type === 'route' &&
          selectedEntity.data.id === route.id

        const isHovered = hoveredRoute === route.id

        return (
          <Line
            key={route.id}
            points={points}
            color={isSelected ? itemColorSelected : isHovered ? itemColorHovered : itemColor}
            lineWidth={ROUTE.WIDTH}
            onClick={e => {
              e.stopPropagation()
              rootModel.selection.selectRoute(route)
            }}
            onPointerOver={e => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
              setHoveredRoute(route.id)
            }}
            onPointerOut={e => {
              e.stopPropagation()
              document.body.style.cursor = 'auto'
              setHoveredRoute(null)
            }}
          />
        )
      })}
    </group>
  )
})
