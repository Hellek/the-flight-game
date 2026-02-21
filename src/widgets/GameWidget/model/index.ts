import { createProvider } from '@core/di/createProvider';
import { GameModel } from './GameModel';

export const { Provider: GameModelProvider, useModel: useGameModel } = createProvider(GameModel);
