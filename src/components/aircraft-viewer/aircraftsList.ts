import type { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react'
import type { Mesh } from 'three'
import { Airplane } from '@components/Airplane'
import type { ThreeEvent } from '@react-three/fiber'

// Интерфейс для пропсов модели самолета
export interface AircraftModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  color?: string
  onClick?: (e: ThreeEvent<MouseEvent>) => void
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void
}

// Интерфейс для модели самолета
export type AircraftViewerModel =
  | ForwardRefExoticComponent<AircraftModelProps & RefAttributes<Mesh>>
  | ComponentType<AircraftModelProps>

// Список доступных самолетов
export const AircraftsList: Record<string, AircraftViewerModel> = {
  Airplane: Airplane,
}
