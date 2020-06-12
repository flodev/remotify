// @ts-nocheck
import Phaser from "phaser";
import logoImg from "./icon.png";

const config = {
  type: Phaser.WEBGL,
  parent: "phaser-example",
  width: "100%",
  height: "100%",
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
function preload() {
  // @ts-ignore
  this.load.image("logo", logoImg);
  // @ts-ignore
  this.load.tilemapTiledJSON("room-map", "assets/tilemaps/room.json");
  // @ts-ignore
  this.load.image("roomi", "assets/tilemaps/tilemap.png");
  // @ts-ignore
  this.load.image("player", "assets/avatars/player.png");
}
function create() {
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
  // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  // this.cameras.main.setScroll(95, 100);
  // @ts-ignore
  player = this.physics.add.image(400, 400, "player");
  this.physics.add.collider(player, layer);
  cursors = this.input.keyboard.createCursorKeys();
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
