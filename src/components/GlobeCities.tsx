import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'

import { Sphere } from '@react-three/drei'
import { itemColor, itemColorHovered, itemColorSelected } from '../constants'
import { CITY, GLOBE_ROTATION } from '../constants'
import { rootStore } from '../stores'

export const GlobeCities: React.FC = observer(() => {
  const { selectedEntity } = rootStore.selection
  const { cities } = rootStore.city
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  return (
    <group rotation={[GLOBE_ROTATION.X, GLOBE_ROTATION.Y, GLOBE_ROTATION.Z]}>
      {cities.map((city, index) => {
        const isSelected = selectedEntity?.type === 'city' &&
          selectedEntity.data.iata === city.iata

        const isHovered = hoveredCity === city.iata

        return (
          <Sphere
            key={index}
            args={[CITY.SIZE, 16, 16]}
            position={[city.position.x, city.position.y, city.position.z]}
            onClick={e => {
              e.stopPropagation()
              rootStore.selection.selectCity(city)
            }}
            onPointerOver={e => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
              setHoveredCity(city.iata)
            }}
            onPointerOut={e => {
              e.stopPropagation()
              document.body.style.cursor = 'auto'
              setHoveredCity(null)
            }}
          >
            <meshBasicMaterial
              color={isSelected ? itemColorSelected : isHovered ? itemColorHovered : itemColor}
            />
          </Sphere>
        )
      })}
    </group>
  )
})
