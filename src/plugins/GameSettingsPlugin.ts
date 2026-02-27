import { makeAutoObservable } from 'mobx';
import type { Vector3Tuple } from 'three';
import { scope } from '@core/di';

const isProdEnv = import.meta.env.PROD;

@scope.singleton()
export class GameSettingsPlugin {
  /**
   * Игра на паузе — время остановлено
   */
  isPaused: boolean = false;
  /**
   * Видимость маршрутов
  */
  routesVisible: boolean = true;
  /**
   * Прод окружение или нет
  */
  readonly isProdEnv = isProdEnv;
  /**
   * TODO посмотреть как можно это оптимизировать. Возможно эти вычисления производятся на каждый вызов
   * А так же вообще, возможно эту логику как-то еще можно лучше и производительнее написать
   * [x, y, z]
  */
  readonly globeInitialRotation: Vector3Tuple = [Math.PI / 4, Math.PI + (Math.PI / 18) * 3, 0];
  /**
   * Ускорение игрового времени: за 1 реальную секунду проходит 1200 игровых секунд.
   * Поэтому 1 игровой час (3600 с) = 3600/1200 = 3 реальные секунды.
   * TODO подумать, может есть логика вычислений и получше
   */
  readonly timeAccelerationFactor = 1200;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Переключение паузы (остановка/запуск времени)
   */
  togglePause = () => {
    this.isPaused = !this.isPaused;
  };
  /**
   * Переключение видимости маршрута
   */
  toggleRoutesVisible = () => {
    this.routesVisible = !this.routesVisible;
  };
}
