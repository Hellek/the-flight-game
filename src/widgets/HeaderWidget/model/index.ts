import { createProvider } from '@core/di/createProvider';
import { HeaderModel } from './HeaderModel';

export const { Provider: HeaderModelProvider, useModel: useHeaderModel } =
  createProvider(HeaderModel);
