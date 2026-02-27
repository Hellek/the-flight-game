import { createProvider } from '@core/di';
import { CityModel } from './CityModel';

export const { Provider: CityModelProvider, useModel: useCityModel } = createProvider(CityModel);

