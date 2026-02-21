import { makeAutoObservable } from 'mobx';
import { scope } from '@core/di';
import { aircraftsList } from './aircraftsList';

/**
 * ViewModel виджета просмотра 3D-моделей самолётов
 */
@scope.transient()
export class AircraftViewerWidgetModel {
  selectedModelName: string;

  constructor() {
    this.selectedModelName = Object.keys(aircraftsList)[0] ?? 'Airplane';
    makeAutoObservable(this);
  }

  get modelNames(): string[] {
    return Object.keys(aircraftsList);
  }

  get currentModel() {
    return aircraftsList[this.selectedModelName];
  }

  setSelectedModelName = (name: string): void => {
    if (Object.prototype.hasOwnProperty.call(aircraftsList, name)) {
      this.selectedModelName = name;
    }
  };
}
