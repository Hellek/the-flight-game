import { scope } from '@core/di';
import { GameSettingsPlugin } from '@plugins';

/**
 * ViewModel виджета паузы (остановка игрового времени)
 */
@scope.transient()
export class PauseModel {
  constructor(private readonly gameSettings: GameSettingsPlugin) {}

  get isPaused() {
    return this.gameSettings.isPaused;
  }

  togglePause = (): void => {
    this.gameSettings.togglePause();
  };
}
