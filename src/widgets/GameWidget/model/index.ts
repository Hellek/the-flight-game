import { createProvider } from '@core/di';
import { GameModel } from './GameModel';

export const { Provider: GameModelProvider, useModel: useGameModel } = createProvider(GameModel);
