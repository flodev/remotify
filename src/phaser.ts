// @ts-nocheck
import Phaser from "phaser";
import logoImg from "./icon.png";
import "webrtc-adapter";

class VideoStream extends Phaser.GameObjects.Video {
  public loadMediaStream? = async (videoElement: HTMLVideoElement) => {
    this.video = videoElement;
    await this.video.play();
    // this.scene.sys.textures.remove(this._key);

    // @ts-ignore
    this.videoTexture = this.scene.sys.textures.create(
      this._key,
      videoElement,
      videoElement.videoWidth,
      videoElement.videoHeight
    );
    this.videoTextureSource = this.videoTexture.source[0];
    this.videoTexture.add(
      "__BASE",
      0,
      0,
      0,
      videoElement.videoWidth,
      videoElement.videoHeight
    );

    // @ts-ignore
    this.setTexture(this.videoTexture);
    // @ts-ignore
    this.setSizeToFrame();
    this.updateDisplayOrigin();

    // @ts-ignore
    this.emit(
      Phaser.Events.VIDEO_CREATED,
      this,
      videoElement.videoWidth,
      videoElement.videoHeight
    );
    return this;
  };
}

// class VideoStreamPlugin extends Phaser.Plugins.BasePlugin {

//   constructor (pluginManager)
//   {
//       super(pluginManager);

//       //  Register our new Game Object type
//       pluginManager.registerGameObject('videoStream', this.createStream);
//   }

//   createStream (x, y)
//   {
//       return this.displayList.add(new ClownGameObject(this.scene, x, y));
//   }

// }

const config = {
  type: Phaser.WEBGL,
  parent: "phaser-example",
  width: "100%",
  height: "100%",
  dom: {
    createContainer: true,
  },
  // plugins: {
  //   global: [{ key: "VideoStreamPlugin", plugin: VideoStreamPlugin, start: true }],
  // },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: updateDirect,
  },
};

let player;
let cursors;

new Phaser.Game(config);
async function preload() {
  // @ts-ignore
  this.load.image("logo", logoImg);
  // @ts-ignore
  this.load.tilemapTiledJSON("room-map", "assets/tilemaps/room.json");
  // @ts-ignore
  this.load.image("roomi", "assets/tilemaps/tilemap.png");
  // @ts-ignore
  this.load.image("player", "assets/avatars/player.png");
}

async function createVideoElement(phaser) {
  try {
    const constraints = {
      video: true,
      audio: true,
    };
    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    var video = document.createElement("video");
    video.playsinline = true;
    video.srcObject = mediaStream;
    video.width = 320;
    video.height = 240;
    video.autoplay = true;

    const phaserVideo = new Phaser.GameObjects.Video(phaser, 500, 500);
    phaserVideo.width = 320;
    phaserVideo.height = 240;
    phaserVideo.video = video;
    phaser.add.existing(phaserVideo);
  } catch (e) {
    console.log("error", e.message, e.name);
  }
}

async function create() {
  // @ts-ignore
  // const logo = this.add.image(400, 150, "logo");
  // // @ts-ignore
  // this.tweens.add({
  //   targets: logo,
  //   y: 450,
  //   duration: 2000,
  //   ease: "Power2",
  //   yoyo: true,
  //   loop: -1,
  // });
  // @ts-ignore
  const map = this.make.tilemap({ key: "room-map" });
  const tileset = map.addTilesetImage("room", "roomi");
  var layer = map.createStaticLayer("walls", tileset, 0, 0);
  layer.setCollisionByProperty({ collides: true });
  player = this.physics.add.image(400, 400, "player");
  this.physics.add.collider(player, layer);
  cursors = this.input.keyboard.createCursorKeys();

  await createVideoElement(this);
  // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  // this.cameras.main.setScroll(95, 100);
  // @ts-ignore
}

function updateDirect() {
  player.body.setVelocity(0);
  if (cursors.left.isDown) {
    // player.setAngle(-90);
    player.body.setVelocityX(-100);
  } else if (cursors.right.isDown) {
    // player.setAngle(90);
    player.body.setVelocityX(100);
  }

  if (cursors.up.isDown) {
    player.body.setVelocityY(-100);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(100);
  }
}
