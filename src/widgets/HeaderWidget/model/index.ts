import { createProvider } from '@core/di';
import { HeaderModel } from './HeaderModel';

export const { Provider: HeaderModelProvider, useModel: useHeaderModel } =
  createProvider(HeaderModel);
