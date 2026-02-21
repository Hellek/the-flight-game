import { scope } from './scopeDecorators';
import { propsAttribute } from './symbols';

/**
 * Контейнер для передачи props в модель виджета через DI.
 * Инжектируется в конструктор модели; провайдер вызывает set(props) при resolveWithTransforms.
 */
@scope.transient()
export class Props<PropsType extends object = object> {
  static [propsAttribute] = true;
  readonly current: Readonly<PropsType> = {} as PropsType;

  /** Внутренний метод: вызывается провайдером при resolveWithTransforms. */
  set(props: Partial<PropsType>): void {
    const cur = this.current as Record<string, unknown>;
    Object.assign(cur, props);
    for (const key of Object.keys(cur)) {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        delete cur[key];
      }
    }
  }
}
