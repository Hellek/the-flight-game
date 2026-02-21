import { describe, expect, it, vi } from 'vitest';
import { destroy, scope } from '@core/di';
import { DIContainer, rootContainer, scopeToLifecycle } from '../container';
import type { Constructor, Destroyable } from '../types';

@scope.transient()
class Foo {
  id = Math.random();
}

@scope.transient()
class FirstProps {
  field = 1;
}

@scope.transient()
class SecondProps {
  field = 1;
}

@scope.transient()
class ModelWithProps {
  constructor(
    readonly firstProps: FirstProps,
    readonly secondProps: SecondProps,
  ) { }
}

@scope.transient()
class DestroyableService {
  id = Math.random();
  declare [destroy]: ReturnType<typeof vi.fn>;

  constructor() {
    (this as unknown as Record<symbol, ReturnType<typeof vi.fn>>)[destroy] = vi.fn();
  }
}

describe('DIContainer', () => {
  it('rootContainer is a DIContainer', () => {
    expect(rootContainer).toBeInstanceOf(DIContainer);
    expect(rootContainer.container).toBeDefined();
  });

  it('resolve returns instance from Tsyringe container', () => {
    const a = rootContainer.resolve(Foo);
    const b = rootContainer.resolve(Foo);
    expect(a).toBeInstanceOf(Foo);
    expect(b).toBeInstanceOf(Foo);
    // Transient by default: different instances
    expect(a.id).not.toBe(b.id);
  });

  it('child creates child container and returns same instance for same name', () => {
    const child1 = rootContainer.child('test-child');
    const child2 = rootContainer.child('test-child');
    expect(child1).toBe(child2);
    expect(child1).toBeInstanceOf(DIContainer);
  });

  it('childrenExists returns true after child created', () => {
    const name = 'child-' + Math.random();
    expect(rootContainer.childrenExists(name)).toBe(false);
    rootContainer.child(name);
    expect(rootContainer.childrenExists(name)).toBe(true);
  });

  it('child container resolve is isolated (transient in child)', () => {
    const child = rootContainer.child('isolated-' + Math.random());
    const a = child.resolve(Foo);
    const b = child.resolve(Foo);
    expect(a).not.toBe(b);
  });

  it('destroy on root container throws', () => {
    expect(() => rootContainer.destroy()).toThrow(/Cannot destroy root/);
  });

  it('destroy clears children and prevents further resolve', () => {
    const parent = rootContainer.child('destroy-test');
    const childContainer = parent.child('c1');
    expect(childContainer).toBeInstanceOf(DIContainer);
    parent.resolve(Foo);
    parent.destroy();
    expect(() => parent.resolve(Foo)).toThrow(/destroyed/);
    expect(() => parent.child('c2')).toThrow(/destroyed/);
  });

  it('destroy on child does not affect parent', () => {
    const parent = rootContainer.child('parent-' + Math.random());
    const childContainer = parent.child('child-' + Math.random());
    childContainer.destroy();
    expect(() => parent.resolve(Foo)).not.toThrow();
  });

  describe('resolveWithTransforms', () => {
    it('calls transform with constructor args and mutated args are used for instance', () => {
      const child = rootContainer.child('transforms-' + Math.random());

      const model = child.resolveWithTransforms(ModelWithProps as Constructor<ModelWithProps>, args => {
        const second = args.find((a): a is SecondProps => a instanceof SecondProps);
        if (second) second.field = 2;
      });

      expect(model.firstProps.field).toBe(1);
      expect(model.secondProps.field).toBe(2);
    });

    it('transform receives args in constructor order', () => {
      const child = rootContainer.child('transforms-order-' + Math.random());
      child.resolveWithTransforms(ModelWithProps as Constructor<ModelWithProps>, args => {
        expect(args[0]).toBeInstanceOf(FirstProps);
        expect(args[1]).toBeInstanceOf(SecondProps);
      });
    });
  });

  describe('destroyInstance', () => {
    it('calls [destroy] on instance and removes from container tracking', () => {
      const child = rootContainer.child('destroy-instance-' + Math.random());
      const a = child.resolve(DestroyableService);
      const b = child.resolve(DestroyableService);
      const aDestroy = (a as unknown as Record<symbol, ReturnType<typeof vi.fn>>)[destroy];
      const bDestroy = (b as unknown as Record<symbol, ReturnType<typeof vi.fn>>)[destroy];
      expect(aDestroy).not.toHaveBeenCalled();
      expect(bDestroy).not.toHaveBeenCalled();
      child.destroyInstance(a as Partial<Destroyable>);
      expect(aDestroy).toHaveBeenCalledTimes(1);
      expect(bDestroy).not.toHaveBeenCalled();
      child.destroyInstance(b as Partial<Destroyable>);
      expect(bDestroy).toHaveBeenCalledTimes(1);
    });

    it('destroyInstance on non-tracked instance does not throw', () => {
      const child = rootContainer.child('destroy-untracked-' + Math.random());
      const plain = { [destroy]: vi.fn() };
      expect(() => child.destroyInstance(plain as Partial<Destroyable>)).not.toThrow();
      expect(plain[destroy]).not.toHaveBeenCalled();
    });
  });

  describe('destroy container lifecycle', () => {
    it('destroy() calls [destroy] on all tracked instances', () => {
      const child = rootContainer.child('destroy-lifecycle-' + Math.random());
      const a = child.resolve(DestroyableService);
      const b = child.resolve(DestroyableService);
      child.destroy();
      expect((a as unknown as Record<symbol, ReturnType<typeof vi.fn>>)[destroy]).toHaveBeenCalledTimes(1);
      expect((b as unknown as Record<symbol, ReturnType<typeof vi.fn>>)[destroy]).toHaveBeenCalledTimes(1);
    });
  });
});

describe('scopeToLifecycle', () => {
  it('is exported and returns Lifecycle enum', () => {
    expect(typeof scopeToLifecycle('TRANSIENT')).toBe('number');
  });
});
