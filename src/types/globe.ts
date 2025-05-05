import { Vector3 } from 'three';

export interface GlobePoint {
  id: string;
  position: Vector3;
  name: string;
  data?: any;
}

export interface GlobeProps {
  points?: GlobePoint[];
  onPointClick?: (point: GlobePoint) => void;
  initialRotation?: [number, number, number];
  initialScale?: number;
}
