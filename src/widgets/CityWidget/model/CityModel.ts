import { Euler, Vector3 } from 'three';
import { init, Props, scope } from '@core/di';
import { GeometryPlugin, ZERO_VECTOR } from '@plugins';
import { type City, SelectedEntityType, SelectionService } from '@services';
import { styleVars } from '@ui';

export interface CityModelProps {
  city: City;
}

const CITY = { SIZE: 0.005 };

@scope.transient()
export class CityModel {
  private _city!: City;
  private _isHovered = false;
  private _cachedPosition?: Vector3;
  private _cachedEulerRotation?: Euler;

  constructor(
    public readonly props: Props<CityModelProps>,
    private readonly selectionService: SelectionService,
    private readonly geometry: GeometryPlugin,
  ) { }

  [init](props: CityModelProps): void {
    this._city = props.city;
  }

  /** До вызова [init] читаем city из props.current (провайдер выставляет его при создании модели). */
  get city(): City | undefined {
    return this._city ?? this.props.current?.city;
  }

  get isHovered(): boolean {
    return this._isHovered;
  }

  setHovered = (value: boolean): void => {
    this._isHovered = value;
  };

  get isSelected(): boolean {
    const c = this.city;
    if (!c) return false;
    const { selectedEntity } = this.selectionService;
    return selectedEntity?.type === SelectedEntityType.city && selectedEntity.data.iata === c.iata;
  }

  get color(): string {
    const { isSelected, isHovered } = this;

    if (isSelected) return styleVars.colorItemSelected;
    if (isHovered) return styleVars.colorItemHovered;
    return styleVars.colorItem;
  }

  get size(): number {
    return CITY.SIZE;
  }

  get position(): Vector3 {
    const c = this.city;
    if (!c) return ZERO_VECTOR.clone();

    if (!this._cachedPosition) {
      this._cachedPosition = c.position.clone();
    }

    return this._cachedPosition.clone();
  }

  get eulerRotation(): Euler {
    const c = this.city;
    if (!c) return new Euler();
    if (!this._cachedEulerRotation) {
      this._cachedEulerRotation = this.geometry.positionOnSphereToEuler(c.position);
    }
    return this._cachedEulerRotation.clone();
  }

  select = (): void => {
    const c = this.city;
    if (c) this.selectionService.selectCity(c);
  };
}
