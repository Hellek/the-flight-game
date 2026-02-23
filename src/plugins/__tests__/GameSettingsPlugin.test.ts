import { describe, expect, it } from 'vitest';
import { GameSettingsPlugin } from '../GameSettingsPlugin';

describe('GameSettingsPlugin', () => {
  it('инициализируется с routesVisible: true', () => {
    const plugin = new GameSettingsPlugin();
    expect(plugin.routesVisible).toBe(true);
  });

  it('имеет timeAccelerationFactor равный 1200', () => {
    const plugin = new GameSettingsPlugin();
    expect(plugin.timeAccelerationFactor).toBe(1200);
  });

  it('имеет globeInitialRotation из трёх чисел', () => {
    const plugin = new GameSettingsPlugin();
    expect(plugin.globeInitialRotation).toHaveLength(3);
    expect(plugin.globeInitialRotation[0]).toBeDefined();
    expect(plugin.globeInitialRotation[1]).toBeDefined();
    expect(plugin.globeInitialRotation[2]).toBeDefined();
  });

  it('toggleRoutesVisible переключает routesVisible', () => {
    const plugin = new GameSettingsPlugin();
    expect(plugin.routesVisible).toBe(true);
    plugin.toggleRoutesVisible();
    expect(plugin.routesVisible).toBe(false);
    plugin.toggleRoutesVisible();
    expect(plugin.routesVisible).toBe(true);
  });
});
