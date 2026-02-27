import {
  Euler,
  Matrix4,
  Quaternion,
  Vector3,
} from 'three';
import { scope } from '@core/di';

/** Нулевой вектор (0, 0, 0). Заморожен — мутация приведёт к ошибке в strict mode. При необходимости клонировать. */
export const ZERO_VECTOR: Readonly<Vector3> = Object.freeze(new Vector3(0, 0, 0));

const ORIGIN = Object.freeze(new Vector3(0, 0, 0));
const UP = Object.freeze(new Vector3(0, 1, 0));
const rotationMatrixScratch = new Matrix4();
const quaternionScratch = new Quaternion();

@scope.singleton()
export class GeometryPlugin {
  /**
   * Преобразует широту и долготу (в градусах) в точку на единичной сфере (Vector3).
   * Используется для размещения городов на глобусе.
   * @param lat - широта в градусах
   * @param lon - долгота в градусах
   * @returns вектор на единичной сфере
   */
  latLonToVector3(lat: number, lon: number): Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new Vector3(
      -Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta),
    );
  }

  /**
   * Вычисляет расстояние между двумя точками на сфере (Земле) по формуле гаверсинусов.
   * @param pos1 - первая точка в декартовых координатах (Vector3 на единичной сфере)
   * @param pos2 - вторая точка в декартовых координатах
   * @returns расстояние в километрах
   */
  calculateDistance(pos1: Vector3, pos2: Vector3): number {
    // Преобразуем декартовы координаты в сферические
    const lat1 = Math.asin(pos1.y);
    const lon1 = Math.atan2(pos1.z, pos1.x);
    const lat2 = Math.asin(pos2.y);
    const lon2 = Math.atan2(pos2.z, pos2.x);

    // Радиус Земли в километрах
    const earthRadiusKm = 6371;

    // Формула гаверсинусов
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  }

  /**
   * Вычисляет углы Эйлера для ориентации объекта в точке на единичной сфере
   * (взгляд «от центра сферы наружу»). Используется для меток городов на глобусе.
   * @param position - точка на единичной сфере (нормаль от центра)
   * @returns углы поворота (Euler)
   */
  positionOnSphereToEuler(position: Vector3): Euler {
    const normal = position.clone().normalize();
    rotationMatrixScratch.lookAt(ORIGIN, normal, UP);
    quaternionScratch.setFromRotationMatrix(rotationMatrixScratch);
    const euler = new Euler();
    euler.setFromQuaternion(quaternionScratch);
    euler.y += Math.PI;
    return euler;
  }
}
