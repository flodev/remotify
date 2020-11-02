const PLAYER_OFFSET = -40
const PLAYER_VIDEO_OFFSET = -80
const CONTAINER_WIDTH = 30
const CONTAINER_HEIGHT = 10

export class Player {
  private lastX?: number
  private lastY?: number
  private movePoints = Array<number[]>()
  private container!: Phaser.GameObjects.Container
  private mask?: Phaser.GameObjects.Graphics
  private currentMovePoint?: number[]
  private currentTargetPoint?: number[]
  private config?: { position: { x: number; y: number } }
  constructor(
    private scene: Phaser.Scene,
    public id: string,
    public userName: string
  ) {}

  load() {
    this.scene.load.image("player", "assets/avatars/player.png")
  }

  setConfig(config: { position: { x: number; y: number }; data?: any }) {
    this.config = config
  }

  public async spawn() {
    if (!this.config) {
      throw new Error("config not found")
    }
    const playerImage = new Phaser.GameObjects.Image(
      this.scene,
      0,
      PLAYER_OFFSET,
      "player"
    )

    this.container = this.scene.add.container(
      this.config.position.x,
      this.config.position.y
    )
    this.container.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT)

    this.mask = new Phaser.GameObjects.Graphics(this.scene)
    this.mask.fillCircle(
      this.config.position.x,
      this.config.position.y + PLAYER_VIDEO_OFFSET,
      20
    )
    this.mask.fillStyle(0xffffff)

    const text = this.scene.add.text(CONTAINER_WIDTH * -1, 0, this.userName, {
      color: "#000000",
    })
    this.container.add(text)
    const phaserVideo = await this.createVideoElement()
    this.container.add(playerImage)

    phaserVideo?.setMask(phaserVideo?.createBitmapMask(this.mask))
    this.scene.add.existing(phaserVideo!)
    this.container.add(phaserVideo!)
  }

  public setWaypoints(movePoints: Array<number[]>) {
    console.log(
      "player received waypoints",
      this.userName,
      JSON.stringify(movePoints)
    )
    this.movePoints = movePoints
    this.currentTargetPoint = movePoints[movePoints.length - 1]
  }

  public getCurrentTargetPoint() {
    if (this.currentTargetPoint) {
      return { x: this.currentTargetPoint[0], y: this.currentTargetPoint[1] }
    }
    return { x: this.config?.position.x, y: this.config?.position.y }
  }

  async createVideoElement() {
    try {
      const constraints = {
        video: {width: {exact: 1280}, height: {exact: 720}},
        audio: true,
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      var video = document.createElement("video")
      video.srcObject = mediaStream
      video.width = 1280
      video.height = 720
      video.autoplay = true

      const phaserVideo = new Phaser.GameObjects.Video(
        this.scene,
        0,
        PLAYER_VIDEO_OFFSET
      )

      phaserVideo.width = 320
      phaserVideo.height = 240
      phaserVideo.setScale(0.1, 0.1)
      phaserVideo.video = video
      // phaserVideo.setMask(mask);
      return phaserVideo
    } catch (e) {
      console.log("error", e.message, e.name)
    }
  }

  public update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (this.lastX === undefined) {
      this.lastX = this.container.x
      this.lastY = this.container.y
    }
    const playerContainerBody = this.container
      .body as Phaser.Physics.Arcade.Body
    // playerContainerBody.setVelocity(0);
    if (cursors.left!.isDown) {
      // this.container.setAngle(-90);
      playerContainerBody.setVelocityX(-100)
    } else if (cursors.right!.isDown) {
      // this.container.setAngle(90);
      playerContainerBody.setVelocityX(100)
    }

    if (cursors.up!.isDown) {
      playerContainerBody.setVelocityY(-100)
    } else if (cursors.down!.isDown) {
      playerContainerBody.setVelocityY(100)
    }
    this.movePlayer()

    if (this.mask) {
      this.mask.x += this.container.x - (this.lastX ?? 0)
      this.mask.y += this.container.y - (this.lastY ?? 0)
    }

    this.lastX = this.container.x
    this.lastY = this.container.y
    this.stopMovementIfPointReached()
  }

  movePlayer = () => {
    if (this.movePoints.length && !this.currentMovePoint) {
      this.currentMovePoint = this.movePoints.shift()
      console.log("move to ", this.currentMovePoint)
      this.scene.physics.moveTo(
        this.container,
        this.currentMovePoint![0],
        this.currentMovePoint![1],
        200
      )
    }
  }

  stopMovementIfPointReached = () => {
    if (!this.currentMovePoint) {
      return
    }
    const playerContainerBody = this.container
      .body as Phaser.Physics.Arcade.Body
    var distance = Phaser.Math.Distance.Between(
      this.container.x,
      this.container.y,
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

  getContainer() {
    return this.container
  }
}
