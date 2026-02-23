import { createProvider } from '@core/di';
import { AircraftInfoModel } from './AircraftInfoModel';

export const { Provider: AircraftInfoModelProvider, useModel: useAircraftInfoModel } = createProvider(
  AircraftInfoModel,
);
