import { makeAutoObservable } from 'mobx';
import { scope } from '@core/di';

@scope.singleton()
export class GameSettingsService {
  showRoutes: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  toggleRoutes = () => {
    this.showRoutes = !this.showRoutes;
  };
}
