import { Lifecycle } from 'tsyringe';
import { describe, expect, it } from 'vitest';
import { scopeToLifecycle } from '../container';
import { type Scope, scopes } from '../scope';

describe('scope', () => {
  it('exports TRANSIENT, CONTAINER, SINGLETON', () => {
    expect(scopes.TRANSIENT).toBe('TRANSIENT');
    expect(scopes.CONTAINER).toBe('CONTAINER');
    expect(scopes.SINGLETON).toBe('SINGLETON');
  });

  it('Scope type includes all scope values', () => {
    const s: Scope = scopes.TRANSIENT;
    expect(['TRANSIENT', 'CONTAINER', 'SINGLETON']).toContain(s);
  });
});

describe('scopeToLifecycle', () => {
  it('maps TRANSIENT to Lifecycle.Transient', () => {
    expect(scopeToLifecycle('TRANSIENT')).toBe(Lifecycle.Transient);
  });

  it('maps CONTAINER to Lifecycle.ContainerScoped', () => {
    expect(scopeToLifecycle('CONTAINER')).toBe(Lifecycle.ContainerScoped);
  });

  it('maps SINGLETON to Lifecycle.Singleton', () => {
    expect(scopeToLifecycle('SINGLETON')).toBe(Lifecycle.Singleton);
  });

  it('returns Transient for unknown scope', () => {
    expect(scopeToLifecycle('UNKNOWN')).toBe(Lifecycle.Transient);
  });
});
