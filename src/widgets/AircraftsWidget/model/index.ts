import { createProvider } from '@core/di';
import { AircraftsModel } from './AircraftsModel';

export const { Provider: AircraftsModelProvider, useModel: useAircraftsModel } =
  createProvider(AircraftsModel);
