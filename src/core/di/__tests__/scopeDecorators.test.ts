import { describe, expect, it } from 'vitest';
import { scope } from '@core/di';
import { rootContainer } from '../container';

@scope.transient()
class TransientService {
  id = Math.random();
}

@scope.container()
class ContainerService {
  id = Math.random();
}

@scope.singleton()
class SingletonService {
  id = Math.random();
}

describe('scope decorators', () => {
  describe('@scope.transient()', () => {
    it('returns new instance on every resolve', () => {
      const a = rootContainer.resolve(TransientService);
      const b = rootContainer.resolve(TransientService);
      expect(a).toBeInstanceOf(TransientService);
      expect(b).toBeInstanceOf(TransientService);
      expect(a.id).not.toBe(b.id);
    });

    it('child container also creates new instances', () => {
      const child = rootContainer.child('transient-child-' + Math.random());
      const a = child.resolve(TransientService);
      const b = child.resolve(TransientService);
      expect(a.id).not.toBe(b.id);
    });
  });

  describe('@scope.container()', () => {
    it('returns same instance within same container', () => {
      const a = rootContainer.resolve(ContainerService);
      const b = rootContainer.resolve(ContainerService);
      expect(a).toBe(b);
      expect(a.id).toBe(b.id);
    });

    it('returns different instances in different containers', () => {
      const child = rootContainer.child('container-child-' + Math.random());
      const rootInstance = rootContainer.resolve(ContainerService);
      const childInstance = child.resolve(ContainerService);
      expect(rootInstance).not.toBe(childInstance);
      expect(rootInstance.id).not.toBe(childInstance.id);
    });
  });

  describe('@scope.singleton()', () => {
    it('returns same instance from root and child containers', () => {
      const rootInstance = rootContainer.resolve(SingletonService);
      const child = rootContainer.child('singleton-child-' + Math.random());
      const childInstance = child.resolve(SingletonService);
      expect(rootInstance).toBe(childInstance);
      expect(rootInstance.id).toBe(childInstance.id);
    });

    it('returns same instance on multiple resolve', () => {
      const a = rootContainer.resolve(SingletonService);
      const b = rootContainer.resolve(SingletonService);
      expect(a).toBe(b);
    });
  });
});
