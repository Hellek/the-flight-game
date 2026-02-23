import { Vector3 } from 'three';
import { scope } from '@core/di';

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
}
