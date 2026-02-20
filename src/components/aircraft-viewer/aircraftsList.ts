import React from 'react'
import { type Mesh } from 'three'

import { type ThreeEvent } from '@react-three/fiber'
import { Airplane } from '../Airplane'

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
  | React.ForwardRefExoticComponent<AircraftModelProps & React.RefAttributes<Mesh>>
  | React.ComponentType<AircraftModelProps>

// Список доступных самолетов
export const AircraftsList: Record<string, AircraftViewerModel> = {
  Airplane: Airplane,
}
