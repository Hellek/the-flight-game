import React from 'react'

import { Airplane } from '../Airplane'

// Интерфейс для модели самолета
export type AircraftViewerModel = React.ForwardRefExoticComponent<any> | React.ComponentType<any>

// Список доступных самолетов
export const AircraftsList: Record<string, AircraftViewerModel> = {
  Airplane: Airplane,
}
