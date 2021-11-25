import { Player as PlayerModel } from '@remotify/models'
import { CreateObjectFromModel } from '../CreateObjectFromModel'
import { Player } from '.'
import { GameObjectUpdatable } from '../gameobjects'
import { ZIndexer } from '../utils'
import { calculateWaypoints } from '../../graphql'

type Config = {
  scene: Phaser.Scene
  zIndexer: ZIndexer
  calculateWaypoints: calculateWaypoints
  makeCollide(player: Player): void
}

export class PlayerFactory
  implements
    CreateObjectFromModel<PlayerModel, GameObjectUpdatable<PlayerModel>> {
  constructor(private config: Config) {}
  public create(model: PlayerModel) {
    const { scene, zIndexer, calculateWaypoints, makeCollide } = this.config
    console.log('creating new player')
    const player = new Player(scene, model, zIndexer, calculateWaypoints)
    makeCollide(player)
    scene.add.existing(player)
    return player
  }
}
