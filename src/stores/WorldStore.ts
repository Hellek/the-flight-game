import { makeAutoObservable } from 'mobx';
import { World } from '../types/types';

export class WorldStore {
  world: World | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setWorld(world: World) {
    this.world = world;
  }
}
