import { createProvider } from '@core/di';
import { InfoPanelModel } from './InfoPanelModel';

export const { Provider: InfoPanelModelProvider, useModel: useInfoPanelModel } =
  createProvider(InfoPanelModel);
