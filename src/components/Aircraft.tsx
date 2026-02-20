import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Airplane } from '@components/Airplane'
import { DebugWrapper } from '@components/DebugWrapper'
import { AIRCRAFT, aircraftColor, itemColorHovered, itemColorSelected } from '@constants'
import { rootModel } from '@models'
import type { ThreeEvent } from '@react-three/fiber'
import type { Aircraft as AircraftType } from '@types'

interface AircraftProps {
  aircraft: AircraftType;
}

export const Aircraft = observer(({ aircraft }: AircraftProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const { selectedEntity } = rootModel.selection
  const currentPoint = rootModel.aircraft.getAircraftPosition(aircraft)
  const rotation = rootModel.aircraft.getAircraftRotation(aircraft)

  const isSelected = selectedEntity?.type === 'aircraft' &&
    selectedEntity.data.id === aircraft.id

  const color = isSelected ? itemColorSelected : isHovered ? itemColorHovered : aircraftColor

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    rootModel.selection.selectAircraft(aircraft)
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
