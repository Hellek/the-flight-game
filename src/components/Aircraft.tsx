import React, { useRef } from 'react'
import { observer } from 'mobx-react-lite'

import { Sphere } from '@react-three/drei'
import { itemColor, itemColorHovered, itemColorSelected } from '../constants'
import { AIRCRAFT } from '../constants'
import { rootStore } from '../stores'
import { type Aircraft as AircraftType, Route } from '../types'

interface AircraftProps {
  aircraft: AircraftType;
  route: Route;
}

export const Aircraft: React.FC<AircraftProps> = observer(({ aircraft, route }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { selectedEntity } = rootStore.selection
  const [isHovered, setIsHovered] = React.useState(false)
  const currentPoint = rootStore.aircraft.getAircraftPosition(aircraft, route)

  const isSelected = selectedEntity?.type === 'aircraft' &&
    selectedEntity.data.id === aircraft.id

  return (
    <Sphere
      ref={meshRef}
      args={[AIRCRAFT.SIZE, 16, 16]}
      position={[currentPoint.x, currentPoint.y, currentPoint.z]}
      onClick={e => {
        e.stopPropagation()
        rootStore.selection.selectAircraft(aircraft)
      }}
      onPointerOver={e => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
        setIsHovered(true)
      }}
      onPointerOut={e => {
        e.stopPropagation()
        document.body.style.cursor = 'auto'
        setIsHovered(false)
      }}
    >
      <meshBasicMaterial
        color={isSelected ? itemColorSelected : isHovered ? itemColorHovered : itemColor}
      />
    </Sphere>
  )
})
