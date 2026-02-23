import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { scope } from '@core/di';
import {
  AircraftService,
  type AircraftSize,
  type Route,
  RouteService,
  SelectedEntityType,
  SelectionService,
} from '@services';

/**
 * Собственные типы панели
 */
export enum InfoPanelInnerTypeKey {
  mainMenu = 'mainMenu',
}

/** Все типы панели */
export type PanelTypeKey = InfoPanelInnerTypeKey | SelectedEntityType;

/**
 * ViewModel виджета информационной панели
 */
@scope.transient()
export class InfoPanelModel {
  private _panelTypeKey: PanelTypeKey | null = null;
  private readonly disposeReaction: () => void;

  constructor(
    private readonly selectionService: SelectionService,
    private readonly routeService: RouteService,
    private readonly aircraftService: AircraftService,
  ) {
    makeAutoObservable(this);

    this.disposeReaction = reaction(
      () => this.selectionService.selectedEntity,
      selectedEntity => {
        runInAction(() => {
          this._panelTypeKey = selectedEntity ? selectedEntity.type : null;
        });
      },
      { fireImmediately: true },
    );
  }

  /** Отписаться от изменений selection (вызвать при уничтожении модели) */
  dispose(): void {
    this.disposeReaction();
  }

  get panelTypeKey() {
    return this._panelTypeKey;
  }

  get selectedEntity() {
    return this.selectionService.selectedEntity;
  }

  /** Заголовок панели в зависимости от контента */
  get panelTitle(): string {
    switch (this._panelTypeKey) {
      case InfoPanelInnerTypeKey.mainMenu:
        return 'Меню';
      case SelectedEntityType.city:
        return 'Город';
      case SelectedEntityType.route:
        return 'Маршрут';
      case SelectedEntityType.aircraft:
        return 'Воздушное судно';
      case SelectedEntityType.changelog:
        return 'Изменения';
      default:
        return '';
    }
  }

  readonly openMainMenu = (): void => {
    this._panelTypeKey = InfoPanelInnerTypeKey.mainMenu;
  };
  readonly close = (): void => {
    this._panelTypeKey = null;

    if (this.selectionService.selectedEntity) {
      this.selectionService.clearSelection();
    }
  };
  getDirectDistance = (route: Route): number => {
    return this.routeService.getDirectDistance(route);
  };
  createAircraft = (route: Route, type: AircraftSize): void => {
    this.aircraftService.createAircraft(route, type);
  };
}
