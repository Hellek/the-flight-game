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

  it('togglePause переключает isPaused', () => {
    const plugin = new GameSettingsPlugin();
    expect(plugin.isPaused).toBe(false);
    plugin.togglePause();
    expect(plugin.isPaused).toBe(true);
    plugin.togglePause();
    expect(plugin.isPaused).toBe(false);
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
