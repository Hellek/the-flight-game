import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Line } from '@react-three/drei'
import { itemColor, itemColorHovered, itemColorSelected } from '../constants'
import { GLOBE_ROTATION, ROUTE } from '../constants'
import { rootStore } from '../stores'

export const GlobeRoutes: React.FC = observer(() => {
  const { routes } = rootStore.route
  const { selectedEntity } = rootStore.selection
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null)

  return (
    <group rotation={[GLOBE_ROTATION.X, GLOBE_ROTATION.Y, GLOBE_ROTATION.Z]}>
      {routes.map(route => {
        const points = rootStore.route.getRoutePoints(route)

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
              rootStore.selection.selectRoute(route)
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
