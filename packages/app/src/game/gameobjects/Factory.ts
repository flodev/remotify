import {
  PhaserGameObject,
  PhaserGameObjectPlacable,
  PlaceObjectsTypes,
} from '.'
import {
  DeskSettings,
  GameObject,
  Player,
  Settings,
  ToiletSettings,
} from '@remotify/models'
import { Desk } from './Desk'
import { Toilet } from './Toilet'
import { CreateObjectFromModel } from '../CreateObjectFromModel'
import { ZIndexer } from '../utils'

type Config = {
  scene: Phaser.Scene
  zIndexer: ZIndexer
  players: Player[]
}

export class GameObjectFactory
  implements CreateObjectFromModel<GameObject<Settings>, PhaserGameObject> {
  constructor(private config: Config) {}
  public create(model: GameObject<Settings>): PhaserGameObjectPlacable {
    const { players, scene, zIndexer } = this.config
    switch (model.gameobjectype.name) {
      case PlaceObjectsTypes.Desk:
        const desk = new Desk(model, players, scene, zIndexer)
        scene.add.existing(desk)
        return desk
      case PlaceObjectsTypes.Toilet:
        const toilet = new Toilet(
          model as GameObject<ToiletSettings>,
          scene,
          zIndexer
        )
        scene.add.existing(toilet)
        return toilet
      default:
        throw new Error('unknown game object type ' + model.gameobjectype.name)
    }
  }
}
