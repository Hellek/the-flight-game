import { createProvider } from '@core/di';
import { RouteCreationModel } from './RouteCreationModel';

export const { Provider: RouteCreationModelProvider, useModel: useRouteCreationModel } =
  createProvider(RouteCreationModel);
