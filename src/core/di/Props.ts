import { makeAutoObservable, observable, runInAction } from 'mobx';
import { scope } from './scopeDecorators';
import { propsAttribute } from './symbols';

/**
 * Контейнер для передачи props в модель виджета через DI.
 * Инжектируется в конструктор модели; провайдер вызывает set(props) при resolveWithTransforms и при смене props.
 * current — наблюдаемый объект (shallow), чтобы реакции обновлялись при вызове set().
 */
@scope.transient()
export class Props<PropsType extends object = object> {
  static [propsAttribute] = true;
  readonly current: Readonly<PropsType> = {} as PropsType;

  constructor() {
    makeAutoObservable(this, { current: observable.shallow });
  }

  /** Внутренний метод: вызывается провайдером при resolveWithTransforms и при смене props. */
  set(props: Partial<PropsType>): void {
    runInAction(() => {
      const cur = this.current as Record<string, unknown>;
      Object.assign(cur, props);
      for (const key of Object.keys(cur)) {
        if (!Object.prototype.hasOwnProperty.call(props, key)) {
          delete cur[key];
        }
      }
    });
  }
}
