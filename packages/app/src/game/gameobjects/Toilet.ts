import Phaser, { Input } from 'phaser'
import { GAME_OBJECT_DATA_KEY_ID } from './gameObjectDataKeys'
import { GAME_OBJECT_ID_TOILET } from './gameObjectIds'

import { GameObjectUpdatable } from './GameObjectUpdatable'
import {
  DeskAnimations,
  GameObject,
  Settings,
  ToiletAnimations,
  ToiletContent,
  ToiletInteractions,
  ToiletSettings,
} from '../../models'
import {
  EVENT_GAME_OBJECT_CLICK,
  EVENT_OPEN_INTERACTION_MENU,
} from '../../frontend/app/GameEvents'
import { InteractionReceiver } from '../interact'
import { InteractionMenuEntry } from '../interactionMenu'
import { Player } from '../player'
import {
  createAnimations,
  onClickDetected,
  UnsubscribeFunction,
  ZIndexer,
} from '../utils'
import { GAME_TILE_HEIGHT } from '../../constants'

const Y_OFFSET = -10
export class Toilet
  extends Phaser.GameObjects.Sprite
  implements
    GameObjectUpdatable<GameObject<ToiletSettings>>,
    InteractionReceiver {
  private unsubscribeClick: UnsubscribeFunction
  constructor(
    private gameObjectModel: GameObject<ToiletSettings>,
    public scene: Phaser.Scene,
    private zIndexer: ZIndexer
  ) {
    super(
      scene,
      gameObjectModel.tile.x,
      gameObjectModel.tile.y + Y_OFFSET,
      gameObjectModel.gameobjectype.sprite.name
    )

    this.setDataEnabled()
    this.setData(GAME_OBJECT_DATA_KEY_ID, GAME_OBJECT_ID_TOILET)
    this.setInteractive()
    this.unsubscribeClick = this.listenForClick()
    createAnimations(this.gameObjectModel.gameobjectype.sprite, this)
    this.playModelAnimation()
    this.applyZIndex()
  }

  private applyZIndex() {
    const {
      settings: { occupiedTiles },
    } = this.gameObjectModel
    if (occupiedTiles.length === 0) {
      return
    }
    const lastOccupiedTile = occupiedTiles[occupiedTiles.length - 1]
    const lastOccupiedTileY =
      lastOccupiedTile.y * GAME_TILE_HEIGHT + GAME_TILE_HEIGHT / 2
    const index = this.zIndexer.index(lastOccupiedTileY)
    if (index !== this.depth) {
      this.setDepth(index)
    }
  }

  getFollowUpAnimation(
    settings: ToiletSettings
  ): DeskAnimations | ToiletAnimations | undefined {
    switch (settings.content) {
      case ToiletContent.dump:
        return ToiletAnimations.dump
      case ToiletContent.pee:
        return ToiletAnimations.pee
      default:
        return ToiletAnimations.idle
    }
  }

  stopInteraction(): ToiletSettings {
    const content = this.getContent()
    this.playModelAnimation()
    return { ...this.gameObjectModel.settings, content }
  }

  private getContent() {
    switch (this.anims.currentAnim.key) {
      case ToiletInteractions.take_a_dump:
        return ToiletContent.dump
      case ToiletInteractions.take_a_pee:
        return ToiletContent.pee
      case ToiletInteractions.flush:
        return undefined
      default:
        return undefined
    }
  }

  playModelAnimation() {
    if (this.gameObjectModel.animation) {
      this.play(this.gameObjectModel.animation)
    } else {
      this.play(ToiletAnimations.idle)
    }
  }

  isInteractionReceivable(player: Player): boolean {
    return !!!this.gameObjectModel.player_id
  }

  receiveInteraction(interaction: InteractionMenuEntry): ToiletSettings {
    this.play(interaction.name)
    switch (interaction.name) {
      case ToiletInteractions.take_a_pee: {
        return { ...this.gameObjectModel.settings, content: ToiletContent.pee }
      }
      case ToiletInteractions.take_a_dump: {
        return {
          ...this.gameObjectModel.settings,
          content: ToiletContent.dump,
        }
      }
      default:
        return this.gameObjectModel.settings
    }
  }

  private listenForClick() {
    return onClickDetected(this, (pointer: Phaser.Input.Pointer) => {
      // this.scene.events.emit(EVENT_OPEN_INTERACTION_MENU, this)
      this.scene.events.emit(EVENT_GAME_OBJECT_CLICK, pointer, this)
    })
  }
  getYOffset(): number {
    return 0
  }

  getModel(): GameObject<ToiletSettings> {
    return this.gameObjectModel
  }

  matches(id: string): boolean {
    return this.gameObjectModel.id === id
  }

  updateModel(gameObjectModel: GameObject<ToiletSettings>): void {
    this.gameObjectModel = gameObjectModel
    this.x = gameObjectModel.tile.x
    this.y = gameObjectModel.tile.y + Y_OFFSET
    this.playModelAnimation()
    this.applyZIndex()
  }

  destroy() {
    super.destroy()
    this.unsubscribeClick()
  }
}
