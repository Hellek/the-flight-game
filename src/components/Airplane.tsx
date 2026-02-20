import { forwardRef } from 'react'
import { type Mesh } from 'three'
import { type ThreeEvent } from '@react-three/fiber'
import { Fuselage } from './airplane/Fuselage'
import { NoseCone } from './airplane/NoseCone'
import { TailSection } from './airplane/TailSection'
import { Wings } from './airplane/Wings'

interface AirplaneProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  color?: string
  onClick?: (e: ThreeEvent<MouseEvent>) => void
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void
}

export const Airplane = forwardRef<Mesh, AirplaneProps>(({ color, scale = 1, rotation, ...props }, ref) => {
  return (
    <mesh ref={ref} scale={[scale, scale, scale]} rotation={rotation} {...props}>
      <NoseCone color={color} />
      <Fuselage color={color} />
      <Wings color={color} />
      <TailSection color={color} />
    </mesh>
  )
})
