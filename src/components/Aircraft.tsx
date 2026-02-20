import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import type { ThreeEvent } from '@react-three/fiber'
import { AIRCRAFT, aircraftColor, itemColorHovered, itemColorSelected } from '../constants'
import { rootStore } from '../stores'
import type { Aircraft as AircraftType } from '../types'
import { Airplane } from './Airplane'
import { DebugWrapper } from './DebugWrapper'

interface AircraftProps {
  aircraft: AircraftType;
}

export const Aircraft = observer(({ aircraft }: AircraftProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const { selectedEntity } = rootStore.selection
  const currentPoint = rootStore.aircraft.getAircraftPosition(aircraft)
  const rotation = rootStore.aircraft.getAircraftRotation(aircraft)

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
    <group position={[currentPoint.x, currentPoint.y, currentPoint.z]} rotation={rotation}>
      <DebugWrapper>
        <Airplane
          position={[0, 0, 0]}
          scale={AIRCRAFT.SIZE}
          color={color}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      </DebugWrapper>
    </group>
  )
})
