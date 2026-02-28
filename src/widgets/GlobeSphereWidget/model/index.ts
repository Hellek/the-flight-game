import { createProvider } from '@core/di';
import { GlobeSphereModel } from './GlobeSphereModel';

export const { Provider: GlobeSphereModelProvider, useModel: useGlobeSphereModel } =
  createProvider(GlobeSphereModel);
