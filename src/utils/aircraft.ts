import { AircraftSize } from '@types'

export const getAircraftSizeName = (size: AircraftSize): string => {
  const sizeNames: Record<AircraftSize, string> = {
    [AircraftSize.small]: 'Маленький',
    [AircraftSize.medium]: 'Средний',
    [AircraftSize.large]: 'Большой',
    [AircraftSize.xlarge]: 'Очень большой',
    [AircraftSize.xxlarge]: 'Гигантский',
  }

  return sizeNames[size]
}
