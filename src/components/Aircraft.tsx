import React from 'react'
import { observer } from 'mobx-react-lite'

import { type ThreeEvent } from '@react-three/fiber'
import { AIRCRAFT, aircraftColor, itemColorHovered, itemColorSelected } from '../constants'
import { rootStore } from '../stores'
import { type Aircraft as AircraftType, Route } from '../types'
import { Airplane } from './Airplane'

interface AircraftProps {
  aircraft: AircraftType;
  route: Route;
}

export const Aircraft: React.FC<AircraftProps> = observer(({ aircraft, route }) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const { selectedEntity } = rootStore.selection
  const currentPoint = rootStore.aircraft.getAircraftPosition(aircraft, route)
  const rotation = rootStore.aircraft.getAircraftRotation(aircraft, route)

  const isSelected = selectedEntity?.type === 'aircraft' &&
    selectedEntity.data.id === aircraft.id

  const color = isSelected ? itemColorSelected : isHovered ? itemColorHovered : aircraftColor

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    rootStore.selection.selectAircraft(aircraft)
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
    setIsHovered(true)
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'auto'
    setIsHovered(false)
  }

  return (
    <Airplane
      position={[currentPoint.x, currentPoint.y, currentPoint.z]}
      rotation={rotation}
      scale={AIRCRAFT.SIZE}
      color={color}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  )
})
