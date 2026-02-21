import { scope } from '@core/di';
import { FinanceService } from '@services/FinanceService';
import { GameSettingsService } from '@services/GameSettingsService';
import { SelectionService } from '@services/SelectionService';

/**
 * Модель виджета шапки
 */
@scope.transient()
export class HeaderModel {
  constructor(
    readonly finance: FinanceService,
    readonly selection: SelectionService,
    readonly gameSettings: GameSettingsService,
  ) { }

  get formattedBalance() {
    return this.finance.formattedBalance;
  }

  get showRoutes() {
    return this.gameSettings.showRoutes;
  }

  toggleRoutes = (): void => {
    this.gameSettings.toggleRoutes();
  };
  selectChangelog = (): void => {
    this.selection.selectChangelog();
  };
}
