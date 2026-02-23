import { createProvider } from '@core/di';
import { CreateAircraftModel } from './CreateAircraftModel';

export const { Provider: CreateAircraftModelProvider, useModel: useCreateAircraftModel } =
  createProvider(CreateAircraftModel);
