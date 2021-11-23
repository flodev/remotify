import Phaser from 'phaser'
import i18n from '../../i18n'
import { GAME_OBJECT_DATA_KEY_ID } from './gameObjectDataKeys'
import { GAME_OBJECT_ID_DESK } from './gameObjectIds'
import { TILE_WIDTH } from './index'

import { GameObjectUpdatable } from './GameObjectUpdatable'
import {
  DeskAnimations,
  DeskSettings,
  GameObject,
  Player as PlayerModel,
  Settings,
  ToiletAnimations,
} from '@remotify/models'
import { FONT_DEFAULT, GAME_TILE_HEIGHT } from '../../constants'
import {
  EVENT_GAME_OBJECT_CLICK,
  EVENT_OPEN_INTERACTION_MENU,
} from '../../frontend/app/GameEvents'
import { InteractionReceiver } from '../interact'
import { InteractionMenuEntry } from '../interactionMenu'
import {
  createAnimations,
  onClickDetected,
  UnsubscribeFunction,
  ZIndexer,
} from '../utils'
import { Player } from '../player/player'
const DESK_SIZE_WIDTH = 120
const DESK_SIZE_HEIGHT = 60

export class Desk
  extends Phaser.GameObjects.Container
  implements
    GameObjectUpdatable<GameObject<DeskSettings>>,
    InteractionReceiver {
  private nameText?: Phaser.GameObjects.Text
  private sprite!: Phaser.GameObjects.Sprite
  private unsubscribeClick: UnsubscribeFunction

  constructor(
    private gameObjectModel: GameObject<DeskSettings>,
    private players: PlayerModel[],
    public scene: Phaser.Scene,
    private zIndexer: ZIndexer
  ) {
    super(scene, gameObjectModel.tile.x, gameObjectModel.tile.y)
    this.createBody()
    this.createDataId()
    this.createSprite()
    this.applyNameText()
    this.unsubscribeClick = this.listenForClick()
    createAnimations(gameObjectModel.gameobjectype.sprite, this)
    this.playAnimation()
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
    _settings: Settings
  ): DeskAnimations | ToiletAnimations | undefined {
    return undefined
  }

  private playAnimation() {
    this.sprite.play(this.gameObjectModel.animation || DeskAnimations.idle)
  }

  isInteractionReceivable(player: Player): boolean {
    return (
      !this.gameObjectModel.settings.ownerId ||
      this.gameObjectModel.settings.ownerId === player.getModel().id
    )
  }

  receiveInteraction(interaction: InteractionMenuEntry): DeskSettings {
    this.sprite.play(interaction.name)
    return this.gameObjectModel.settings
  }

  stopInteraction(): DeskSettings {
    this.sprite.stop()
    this.sprite.play(DeskAnimations.idle)
    return this.gameObjectModel.settings
  }

  interact(interaction: InteractionMenuEntry): void {
    this.sprite.play(interaction.name)
  }

  private listenForClick() {
    return onClickDetected(this, (pointer: Phaser.Input.Pointer) => {
      console.log('pointer down yeah')
      // this.scene.events.emit(EVENT_OPEN_INTERACTION_MENU, this)
      this.scene.events.emit(EVENT_GAME_OBJECT_CLICK, pointer, this)
    })
  }

  private applyNameText() {
    const ownerId = this.gameObjectModel.settings.ownerId
    if (!ownerId) {
      if (this.nameText) {
        this.nameText.destroy()
      }
      return
    }
    const owner = this.players.find((player) => player.id === ownerId)
    if (!owner) {
      console.error('cannot find owner by id ' + ownerId)
      return
    }

    const text = i18n.t('Someones desk', {
      someone: owner.username,
    })

    if (this.nameText) {
      this.nameText.setText(text)
    } else {
      this.nameText = this.createNameText(text)
      this.add(this.nameText)
    }
  }

  private createNameText(text: string) {
    return this.scene.add.text(
      DESK_SIZE_WIDTH / -2,
      DESK_SIZE_HEIGHT / 2,
      text,
      {
        color: 'black',
        align: 'center',
        fontSize: '11',
        fontFamily: FONT_DEFAULT,
        fixedWidth: DESK_SIZE_WIDTH,
      }
    )
  }

  private createDataId() {
    this.setDataEnabled()
    this.setData(GAME_OBJECT_DATA_KEY_ID, GAME_OBJECT_ID_DESK)
  }

  private createBody() {
    this.setSize(DESK_SIZE_WIDTH, DESK_SIZE_HEIGHT)
    // this.scene.physics.world.enable(this)
    this.setInteractive()
  }

  private createSprite() {
    this.sprite = this.scene.add.sprite(
      0,
      0,
      this.gameObjectModel.gameobjectype.sprite.name
    )
    this.add(this.sprite)
  }
  getYOffset(): number {
    return TILE_WIDTH * -1
  }

  getModel(): GameObject<DeskSettings> {
    return this.gameObjectModel
  }

  matches(id: string): boolean {
    return this.gameObjectModel.id === id
  }

  updateModel(gameObjectModel: GameObject<DeskSettings>): void {
    this.gameObjectModel = gameObjectModel
    this.x = gameObjectModel.tile.x
    this.y = gameObjectModel.tile.y
    this.applyNameText()
    this.playAnimation()
    this.applyZIndex()
  }

  destroy() {
    super.destroy()
    this.unsubscribeClick()
  }
}
