const PLAYER_OFFSET = -40;
const PLAYER_VIDEO_OFFSET = -80;
let lastX: number;
let lastY: number;
export class Player {
  private movePoints = Array<number[]>()
  private container!: Phaser.GameObjects.Container
  private mask?: Phaser.GameObjects.Graphics
  private currentMovePoint?: number[]
  private currentTargetPoint?: number[]
  private config?: { position: { x: number, y: number } }
  constructor(
    private scene: Phaser.Scene,
    public id: string
  ) {

  }

  load() {
    this.scene.load.image("player", "assets/avatars/player.png");
  }

  setConfig(config: { position: { x: number, y: number }, data?: any }) {
    this.config = config
  }

  public async spawn() {
    if (!this.config) {
      throw new Error('config not found')
    }
    const playerImage = new Phaser.GameObjects.Image(
      this.scene,
      0,
      PLAYER_OFFSET,
      "player"
    );

    this.container = this.scene.add.container(this.config.position.x, this.config.position.y);
    this.container.setSize(30, 10);

    this.mask = new Phaser.GameObjects.Graphics(this.scene);
    this.mask.fillCircle(this.config.position.x, this.config.position.y + PLAYER_VIDEO_OFFSET, 20);
    this.mask.fillStyle(0xffffff);

    // const phaserVideo = await this.createVideoElement();
    this.container.add(playerImage);

    // phaserVideo?.setMask(phaserVideo?.createBitmapMask(this.mask));
    // this.scene.add.existing(phaserVideo!);
    // this.container.add(phaserVideo!);
  }

  public setMovePoints(movePoints: Array<number[]>) {
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
        video: true,
        audio: true,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      var video = document.createElement("video");
      video.srcObject = mediaStream;
      video.width = 320;
      video.height = 240;
      video.autoplay = true;

      const phaserVideo = new Phaser.GameObjects.Video(
        this.scene,
        0,
        PLAYER_VIDEO_OFFSET
      );

      phaserVideo.width = 320;
      phaserVideo.height = 240;
      phaserVideo.setScale(0.1, 0.1);
      phaserVideo.video = video;
      // phaserVideo.setMask(mask);
      return phaserVideo;
    } catch (e) {
      console.log("error", e.message, e.name);
    }
  }


  public update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (lastX === undefined) {
      lastX = this.container.x;
      lastY = this.container.y;
    }
    const playerContainerBody = this.container.body as Phaser.Physics.Arcade.Body;
    // playerContainerBody.setVelocity(0);
    if (cursors.left!.isDown) {
      // this.container.setAngle(-90);
      playerContainerBody.setVelocityX(-100);
    } else if (cursors.right!.isDown) {
      // this.container.setAngle(90);
      playerContainerBody.setVelocityX(100);
    }

    if (cursors.up!.isDown) {
      playerContainerBody.setVelocityY(-100);
    } else if (cursors.down!.isDown) {
      playerContainerBody.setVelocityY(100);
    }
    this.movePlayer()

    if (this.mask) {
      this.mask.x += this.container.x - lastX;
      this.mask.y += this.container.y - lastY;
    }

    lastX = this.container.x;
    lastY = this.container.y;
    this.stopMovementIfPointReached()
  }

  movePlayer = () => {
    if (this.movePoints.length && !this.currentMovePoint) {
      this.currentMovePoint = this.movePoints.shift()
      console.log('move to ', this.currentMovePoint)
      this.scene.physics.moveTo(this.container, this.currentMovePoint![0], this.currentMovePoint![1], 200)
    }
  }

  stopMovementIfPointReached = () => {
    if (!this.currentMovePoint) {
      return
    }
    const playerContainerBody = this.container.body as Phaser.Physics.Arcade.Body;
    var distance = Phaser.Math.Distance.Between(this.container.x, this.container.y, this.currentMovePoint[0], this.currentMovePoint[1]);

    if (playerContainerBody.speed > 0) {

      //  4 is our distance tolerance, i.e. how close the source can get to the target
      //  before it is considered as being there. The faster it moves, the more tolerance is required.
      if (distance < 1) {
        playerContainerBody.reset(this.currentMovePoint[0], this.currentMovePoint[1]);
        this.currentMovePoint = undefined
      }
    }
  }

  getContainer() {
    return this.container
  }
}