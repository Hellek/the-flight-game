import { scope } from '@core/di';
import { GameSettingsPlugin } from '@plugins';
import { FinanceService, SelectionService } from '@services';

/**
 * Модель виджета шапки
 */
@scope.transient()
export class HeaderModel {
  constructor(
    private readonly finance: FinanceService,
    private readonly selection: SelectionService,
    private readonly gameSettings: GameSettingsPlugin,
  ) { }

  get formattedBalance() {
    return this.finance.formattedBalance;
  }

  get showRoutes() {
    return this.gameSettings.routesVisible;
  }

  toggleRoutes = (): void => {
    this.gameSettings.toggleRoutesVisible();
  };
  selectChangelog = (): void => {
    this.selection.selectChangelog();
  };
}
