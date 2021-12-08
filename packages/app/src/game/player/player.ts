import Phaser from 'phaser'
import { GameObjectUpdatable } from '../gameobjects'
import { Player as PlayerModel, PlayerAnimations } from '@remotify/models'
import { createAnimations, ZIndexer } from '../utils'
import { calculateWaypoints } from '../../graphql'
import { Point } from '@remotify/models'
import { FONT_DEFAULT } from '../../constants'

const PLAYER_OFFSET = -40
const PLAYER_VIDEO_OFFSET = -80
const CONTAINER_WIDTH = 30
const CONTAINER_HEIGHT = 10

export class Player
  extends Phaser.GameObjects.Container
  implements GameObjectUpdatable<PlayerModel> {
  private lastX?: number
  private lastY?: number
  private movePoints = Array<number[]>()
  private headMask?: Phaser.GameObjects.Graphics
  private currentMovePoint?: number[]
  private phaserVideo?: Phaser.GameObjects.Video
  private sprite?: Phaser.GameObjects.Sprite
  private nameText?: Phaser.GameObjects.Text
  private isAnimationInProgress: boolean = false
  private movePromise?: Promise<void>
  private movePromiseResolve?: (value: void) => void

  constructor(
    scene: Phaser.Scene,
    private playerModel: PlayerModel,
    private zIndexer: ZIndexer,
    private calculateWaypoints: calculateWaypoints,
    private tile: Point
  ) {
    super(scene, tile.x, tile.y)
    this.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT)
    this.addToUpdateList()
    this.createSprite()
    createAnimations(this.playerModel.sprite, this)
    this.createHeadMask()
    this.createPlayerNameText()
    this.playAnimation()
  }

  playAnimation() {
    if (this.playerModel.animation) {
      this.isAnimationInProgress = true
      this.sprite?.play(this.playerModel.animation)
    }
  }

  matches(id?: string): boolean {
    return id === this.getModel().id
  }

  updateModel(gameObjectModel: PlayerModel): void {
    console.log('player', this.getModel())
    console.log('updated with player', gameObjectModel)
    if (this.getModel().username !== gameObjectModel.username) {
      this.nameText?.setText(gameObjectModel.username)
    }
    if (
      !!gameObjectModel.animation &&
      this.playerModel.animation !== gameObjectModel.animation
    ) {
      this.isAnimationInProgress = true
      this.sprite?.play(gameObjectModel.animation)
    }

    if (!gameObjectModel.animation) {
      this.isAnimationInProgress = false
    }

    if (
      (!gameObjectModel.is_online || !gameObjectModel.is_audio_video_enabled) &&
      this.phaserVideo
    ) {
      this.phaserVideo.destroy()
      this.phaserVideo = undefined
    }

    if (this.shouldMove(gameObjectModel.tile)) {
      let currentPoint: Point = this.playerModel.tile!
      if (this.isMoving()) {
        if (this.currentMovePoint) {
          currentPoint = {
            x: this.currentMovePoint[0],
            y: this.currentMovePoint[1],
          }
        }
        this.stopMovement()
      }
      this.move(this.calculateWaypoints(gameObjectModel.tile!, currentPoint))
    }

    this.playerModel = gameObjectModel
  }

  private stopMovement() {
    this.movePoints = []
    if (this.movePromiseResolve) {
      this.movePromiseResolve()
      console.log('resolved')
    }
    this.movePromiseResolve = undefined
    this.movePromise = undefined
    this.currentMovePoint = undefined
    console.log('undefined')
  }

  private shouldMove(tile?: Point) {
    if (!tile) {
      return false
    }
    const { tile: currentTile } = this.playerModel
    if (!currentTile) {
      return false
    }
    return tile.x !== currentTile.x || tile.y !== currentTile.y
  }

  stopInteraction(): void {
    this.isAnimationInProgress = false
    this.sprite?.play(PlayerAnimations.idle)
  }

  interact(animation: string): void {
    this.isAnimationInProgress = true
    this.sprite?.play(animation)
  }

  private createSprite() {
    this.sprite = this.scene.add.sprite(
      0,
      PLAYER_OFFSET,
      this.playerModel.sprite.name
    )
    this.add(this.sprite!)
  }

  private createHeadMask() {
    this.headMask = new Phaser.GameObjects.Graphics(this.scene)
    this.headMask.fillCircle(this.x, this.y + PLAYER_VIDEO_OFFSET, 20)
    this.headMask.fillStyle(0xffffff)
  }

  private createPlayerNameText() {
    this.nameText = this.scene.add.text(
      CONTAINER_WIDTH * -1,
      7,
      this.playerModel.username,
      {
        color: 'black',
        align: 'center',
        fontSize: '11px',
        fontFamily: FONT_DEFAULT,
        fixedWidth: CONTAINER_WIDTH * 2,
      }
    )
    this.add(this.nameText)
  }

  public async initiateVideo(userMediaStream: MediaStream) {
    const { phaserVideo, video } = await this.createPhaserVideo(userMediaStream)
    this.phaserVideo = phaserVideo
    if (this.headMask) {
      this.phaserVideo.setMask(this.phaserVideo.createBitmapMask(this.headMask))
    }
    this.add(this.phaserVideo)
    await video.play()
  }

  public move(movePoints: Array<number[]>) {
    this.movePromise = new Promise((resolve) => {
      this.movePromiseResolve = resolve
    })
    this.stopInteraction()
    this.movePoints = movePoints
    console.log('new move points', this.movePoints)
    return this.movePromise
  }

  public async isMoveFinished() {
    if (!this.movePromise) {
      console.log('move promise not defined')
      return Promise.resolve()
    }
    return this.movePromise
  }

  public isMoving() {
    return this.movePoints.length > 0
  }

  private async createPhaserVideo(mediaStream: MediaStream) {
    console.log('createPhaserVideo')
    var video = document.createElement('video')
    video.srcObject = mediaStream
    video.playsInline = true
    video.muted = true

    const phaserVideo = this.scene.add.video(0, PLAYER_VIDEO_OFFSET)

    phaserVideo.video = video
    phaserVideo.play(true)
    phaserVideo.addListener(
      Phaser.GameObjects.Events.VIDEO_CREATED,
      (video: Phaser.GameObjects.Video) => {
        video.setDisplaySize(160, 90)
        // phaserVideo.setScale(0.1, 0.1)
      }
    )

    return { phaserVideo, video }
  }

  public preUpdate(...args: any[]) {
    // @ts-ignore
    if (super.preUpdate) {
      // @ts-ignore
      super.preUpdate(...args)
    }
    if (this.lastX === undefined) {
      this.lastX = this.x
      this.lastY = this.y
    }

    this.movePlayer()

    if (this.shouldPlayIdle()) {
      this.sprite?.play(PlayerAnimations.idle)
    }

    if (this.headMask) {
      this.headMask.x += this.x - (this.lastX ?? 0)
      this.headMask.y += this.y - (this.lastY ?? 0)
    }

    this.applyZIndex()

    this.lastX = this.x
    this.lastY = this.y
    this.stopMovementIfPointReached()
    if (
      this.movePoints.length === 0 &&
      this.movePromiseResolve &&
      !this.currentMovePoint
    ) {
      this.movePromiseResolve()
      this.movePromiseResolve = undefined
      this.movePromise = undefined
    }
  }

  private applyZIndex() {
    const index = this.zIndexer.index(this.y)
    if (index !== this.depth) {
      this.setDepth(index)
    }
  }

  private shouldPlayIdle() {
    return (
      !this.isAnimationInProgress &&
      this.movePoints.length === 0 &&
      !this.currentMovePoint &&
      this.sprite?.anims.currentAnim?.key !== PlayerAnimations.idle
    )
  }

  movePlayer = () => {
    if (this.movePoints.length && !this.currentMovePoint) {
      if (this.sprite?.anims.currentAnim?.key !== PlayerAnimations.walk) {
        this.sprite?.play(PlayerAnimations.walk)
      }

      this.currentMovePoint = this.movePoints.shift()
      this.scene.physics.moveTo(
        this,
        this.currentMovePoint![0],
        this.currentMovePoint![1],
        100
      )
    }
  }

  stopMovementIfPointReached = () => {
    if (!this.currentMovePoint) {
      return
    }
    const playerContainerBody = this.body as Phaser.Physics.Arcade.Body
    var distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.currentMovePoint[0],
      this.currentMovePoint[1]
    )

    if (playerContainerBody.speed > 0) {
      //  4 is our distance tolerance, i.e. how close the source can get to the target
      //  before it is considered as being there. The faster it moves, the more tolerance is required.
      if (distance < 4) {
        playerContainerBody.reset(
          this.currentMovePoint[0],
          this.currentMovePoint[1]
        )

        this.currentMovePoint = undefined
      }
    }
  }

  getModel() {
    return this.playerModel
  }
}
