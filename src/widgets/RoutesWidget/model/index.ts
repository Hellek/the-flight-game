import { createProvider } from '@core/di';
import { RoutesModel } from './RoutesModel';

export const { Provider: RoutesModelProvider, useModel: useRoutesModel } = createProvider(RoutesModel);
