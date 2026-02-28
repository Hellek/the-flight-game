import { scope } from '@core/di';
import { GameSettingsPlugin } from '@plugins';
import { SelectionService } from '@services';

/**
 * Модель виджета главного меню (внутри InfoPanelModal)
 */
@scope.transient()
export class MainMenuModel {
  constructor(
    private readonly selection: SelectionService,
    private readonly gameSettings: GameSettingsPlugin,
  ) { }

  get routesVisible() {
    return this.gameSettings.routesVisible;
  }

  toggleRoutesVisible = (): void => {
    this.gameSettings.toggleRoutesVisible();
  };
  selectChangelog = (): void => {
    this.selection.selectChangelog();
  };
}
