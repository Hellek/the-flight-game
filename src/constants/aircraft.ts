import { AircraftSize } from '@services';

// Базовые скорости в км/ч для разных типов самолётов
export const AircraftSpeed = {
  [AircraftSize.small]: 640,
  [AircraftSize.medium]: 720,
  [AircraftSize.large]: 800,
  [AircraftSize.xlarge]: 880,
  [AircraftSize.xxlarge]: 960,
};
