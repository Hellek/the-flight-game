import type { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { Euler, Mesh, Vector3 } from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { Airplane } from '@widgets/AircraftsWidget';

export interface AircraftModelProps {
  position?: Vector3;
  rotation?: Euler;
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
