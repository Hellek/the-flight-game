import { AircraftSize } from '@services';

export const getAircraftSizeName = (size: AircraftSize): string => {
  const sizeNames: Record<AircraftSize, string> = {
    [AircraftSize.small]: 'Маленький',
    [AircraftSize.medium]: 'Средний',
    [AircraftSize.large]: 'Большой',
    [AircraftSize.xlarge]: 'Очень большой',
    [AircraftSize.xxlarge]: 'Гигантский',
  };

  return sizeNames[size];
};

export const formatDistance = (distance: number): string => {
  if (distance < 1000) {
    return `${Math.round(distance)} км`;
  }
  return `${(distance / 1000).toFixed(1)} тыс. км`;
};
