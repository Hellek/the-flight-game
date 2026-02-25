import { createProvider } from '@core/di';
import { MainMenuModel } from './MainMenuModel';

export const { Provider: MainMenuModelProvider, useModel: useMainMenuModel } =
  createProvider(MainMenuModel);
