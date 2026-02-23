import { createProvider } from '@core/di';
import { RouteAircraftsModel } from './RouteAircraftsModel';

export const { Provider: RouteAircraftsModelProvider, useModel: useRouteAircraftsModel } =
  createProvider(RouteAircraftsModel);
