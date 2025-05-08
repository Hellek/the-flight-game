import { makeAutoObservable } from 'mobx'

import { World } from '../types'

export class WorldStore {
  world: World

  constructor(world: World) {
    this.world = world
    makeAutoObservable(this)
  }
}
