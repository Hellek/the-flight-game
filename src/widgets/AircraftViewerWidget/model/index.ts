export { aircraftsList } from './aircraftsList';
export type { AircraftModelProps, AircraftViewerModel } from './aircraftsList';
import { createProvider } from '@core/di';
import { AircraftViewerWidgetModel } from './AircraftViewerWidgetModel';

export const { Provider: AircraftViewerWidgetModelProvider, useModel: useAircraftViewerWidgetModel } =
  createProvider(AircraftViewerWidgetModel);
