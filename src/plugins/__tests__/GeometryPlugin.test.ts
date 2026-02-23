import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { GeometryPlugin } from '../GeometryPlugin';

describe('GeometryPlugin', () => {
  const plugin = new GeometryPlugin();

  describe('latLonToVector3', () => {
    it('возвращает вектор на единичной сфере (длина ≈ 1)', () => {
      const v = plugin.latLonToVector3(55.75, 37.62);
      expect(v).toBeInstanceOf(Vector3);
      expect(v.length()).toBeCloseTo(1, 10);
    });

    it('северный полюс (90, 0) даёт (0, 1, 0)', () => {
      const v = plugin.latLonToVector3(90, 0);
      expect(v.x).toBeCloseTo(0, 10);
      expect(v.y).toBeCloseTo(1, 10);
      expect(v.z).toBeCloseTo(0, 10);
    });

    it('южный полюс (-90, 0) даёт (0, -1, 0)', () => {
      const v = plugin.latLonToVector3(-90, 0);
      expect(v.x).toBeCloseTo(0, 10);
      expect(v.y).toBeCloseTo(-1, 10);
      expect(v.z).toBeCloseTo(0, 10);
    });

    it('экватор (0, 0) даёт точку на экваторе', () => {
      const v = plugin.latLonToVector3(0, 0);
      expect(v.y).toBeCloseTo(0, 10);
      expect(v.length()).toBeCloseTo(1, 10);
    });
  });

  describe('calculateDistance', () => {
    it('расстояние между одной и той же точкой равно 0', () => {
      const p = new Vector3(1, 0, 0).normalize();
      expect(plugin.calculateDistance(p, p.clone())).toBe(0);
    });

    it('противоположные точки на сфере — примерно половина окружности Земли (~20000 км)', () => {
      const p1 = new Vector3(1, 0, 0).normalize();
      const p2 = new Vector3(-1, 0, 0).normalize();
      const km = plugin.calculateDistance(p1, p2);
      expect(km).toBeCloseTo(Math.PI * 6371, -2);
    });

    it('возвращает положительное число для двух разных точек', () => {
      const p1 = plugin.latLonToVector3(55.75, 37.62);
      const p2 = plugin.latLonToVector3(59.93, 30.31);
      const km = plugin.calculateDistance(p1, p2);
      expect(km).toBeGreaterThan(0);
      expect(Number.isFinite(km)).toBe(true);
    });
  });
});
