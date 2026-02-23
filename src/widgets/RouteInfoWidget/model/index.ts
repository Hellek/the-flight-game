import { createProvider } from '@core/di';
import { RouteInfoModel } from './RouteInfoModel';

export const { Provider: RouteInfoModelProvider, useModel: useRouteInfoModel } = createProvider(RouteInfoModel);
