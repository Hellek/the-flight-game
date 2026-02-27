import { createProvider } from '@core/di';
import { PauseModel } from './PauseModel';

export const { Provider: PauseModelProvider, useModel: usePauseModel } =
  createProvider(PauseModel);
