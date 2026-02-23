import type { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { Mesh } from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { Airplane } from '@widgets/AircraftsWidget';

export interface AircraftModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
}

export type AircraftViewerModel =
  | ForwardRefExoticComponent<AircraftModelProps & RefAttributes<Mesh>>
  | ComponentType<AircraftModelProps>;

export const aircraftsList: Record<string, AircraftViewerModel> = { Airplane };
