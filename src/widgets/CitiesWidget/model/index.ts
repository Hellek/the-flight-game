import { createProvider } from '@core/di';
import { CitiesModel } from './CitiesModel';

export const { Provider: CitiesModelProvider, useModel: useCitiesModel } = createProvider(CitiesModel);
