import Phaser, { GameObjects } from "phaser";
var easystarjs = require("easystarjs");
var easystar = new easystarjs.js();
let lastX: number;
let lastY: number;
let flomas: Phaser.GameObjects.Graphics;
let playerContainer: Phaser.GameObjects.Container;
let playerImage;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;

const PLAYER_OFFSET = -40;

export class RoomScene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON("room-map", "assets/tilemaps/room.json");
    this.load.image("roomi", "assets/tilemaps/tilemap.png");
    this.load.image("player", "assets/avatars/player.png");
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
        this,
        0,
        -40 + PLAYER_OFFSET
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

  async create() {
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
    var layer = map.createDynamicLayer("walls", tileset, 0, 0);

    // map.putTileAt(1, 0, 0);
    layer.setCollisionByProperty({ collides: true });
    layer.setCollision(1);
    playerImage = new Phaser.GameObjects.Image(
      this,
      0,
      PLAYER_OFFSET,
      "player"
    );
    // layer.tilemap.putTileAt(, 10, 10);
    map.putTileAt(1, 10, 10);

    const tile = map.getTileAt(10, 10);
    tile.properties = { collides: true };
    // playerMask = getMask(this);
    // playerImage.setMask(playerMask);
    playerContainer = this.add.container(400, 400);
    playerContainer.setSize(80, 10);
    this.physics.world.enable(playerContainer);
    this.physics.add.collider(playerContainer, layer);
    flomas = new Phaser.GameObjects.Graphics(this);
    flomas.fillCircle(400, 360 + PLAYER_OFFSET, 20);
    flomas.fillStyle(0xffffff);
    // const videoMask = getMask(this);

    cursors = this.input.keyboard.createCursorKeys();

    const phaserVideo = await this.createVideoElement();
    playerContainer.add(playerImage);

    phaserVideo?.setMask(phaserVideo?.createBitmapMask(flomas));
    this.add.existing(phaserVideo!);
    playerContainer.add(phaserVideo!);

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const clickedTile = map.getTileAtWorldXY(
        pointer.worldX,
        pointer.worldY,
        true,
        this.cameras.main,
        layer
      );
      const playerTile = map.getTileAtWorldXY(
        playerContainer.x,
        playerContainer.y,
        true
      );
      playerTile.tint = 0xfff;
      clickedTile.tint = 0xfff;
      clickedTile.visible = true;
      playerTile.visible = true;
      console.log(playerTile.x, playerTile.y, clickedTile.x, clickedTile.y);
      const returnvalue = easystar.findPath(
        playerTile.x,
        playerTile.y,
        clickedTile.x,
        clickedTile.y,
        function (...args: any) {
          console.log("path", args);
        }
      );
      easystar.calculate();
      console.log("returnvalue", returnvalue);
    });
    this.cameras.main.startFollow(playerContainer, true, 0.08, 0.08);
    this.cameras.main.setZoom(1);
    const allTiles = map.getTilesWithin();
    console.log("allTiles", allTiles);

    const grid: any[] = [];
    let prevY: number = allTiles[0].y;
    let col: number[] = [];
    allTiles.forEach((tile) => {
      if (tile.y !== prevY) {
        grid.push(col);
        col = [tile.index];
        prevY = tile.y;
      } else {
        col.push(tile.index);
      }
    });
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([9]);
    easystar.enableDiagonals();
    easystar.enableSync();
    // this.textures.addCanvas
    // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // this.cameras.main.setScroll(95, 100);
    // @ts-ignore
  }

  getMask() {
    const maskGraphic = new Phaser.GameObjects.Graphics(this);
    // const maskGraphic = this.add.graphics(0, 0);
    maskGraphic.fillStyle(0xffffff);
    // maskGraphic.arc(5, 5, 5);
    // maskGraphic.fillCircleShape(circle);
    maskGraphic.fillCircle(400, 400, 20);
    // maskGraphic.fillPath();
    return maskGraphic.createGeometryMask();
  }

  update() {
    if (lastX === undefined) {
      lastX = playerContainer.x;
      lastY = playerContainer.y;
    }
    const playerContainerBody = playerContainer.body as Phaser.Physics.Arcade.Body;
    playerContainerBody.setVelocity(0);
    if (cursors.left!.isDown) {
      // playerContainer.setAngle(-90);
      playerContainerBody.setVelocityX(-100);
    } else if (cursors.right!.isDown) {
      // playerContainer.setAngle(90);
      playerContainerBody.setVelocityX(100);
    }

    if (cursors.up!.isDown) {
      playerContainerBody.setVelocityY(-100);
    } else if (cursors.down!.isDown) {
      playerContainerBody.setVelocityY(100);
    }
    flomas.x += playerContainer.x - lastX;
    flomas.y += playerContainer.y - lastY;

    lastX = playerContainer.x;
    lastY = playerContainer.y;
  }
}
