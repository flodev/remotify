import Phaser, { GameObjects } from "phaser";
import { setDebugPoint } from "../utils/setDebugPoint";
import { Player } from "../gameobjects/player";
import { getGrid } from "../utils/getGrid";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { getClientWithRoomsAndPlayers } from "../../graphql";
var easystarjs = require("easystarjs");
var easystar = new easystarjs.js();

let cursors: Phaser.Types.Input.Keyboard.CursorKeys;


export class RoomScene extends Phaser.Scene {
  private player: Player

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config)
    this.player = new Player(this)
  }

  preload() {
    this.load.tilemapTiledJSON("room-map", "assets/tilemaps/room.json");
    this.load.image("roomi", "assets/tilemaps/tilemap.png");
    this.player.load()
  }

  async create() {
    const graphQl = this.registry.get('graphQl') as ApolloClient<InMemoryCache>
    const result = await graphQl.query({ query: getClientWithRoomsAndPlayers })
    const tileMapData = result.data?.client[0]?.rooms[0]?.tile

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
    cursors = this.input.keyboard.createCursorKeys();

    const map = this.make.tilemap({
      tileWidth: 30,
      tileHeight: 30,
      data: tileMapData
    });

    const tileset = map.addTilesetImage("room", "roomi", 30, 30, 0, 0, 0);
    tileset.firstgid = 1
    var layer = map.createDynamicLayer(0, tileset, 0, 0);

    // map.putTileAt(1, 0, 0);
    layer.setCollision([1, 2, 3, 4, 5, 6, 7, 8])
    // layer.setCollisionByProperty({ collides: true });
    // layer.setCollision(1);

    // layer.tilemap.putTileAt(, 10, 10);
    map.putTileAt(1, 10, 10);

    const tile = map.getTileAt(10, 10);
    tile.properties = { collides: true };
    // playerMask = getMask(this);
    // playerImage.setMask(playerMask);
    await this.player.create()

    this.physics.world.enable(this.player.getContainer());
    this.physics.add.collider(this.player.getContainer(), layer);

    // const videoMask = getMask(this);

    //   var curve = new Phaser.Curves.Spline([
    //     100, 500,
    //     260, 450,
    //     300, 250,
    //     550, 145,
    //     745, 256
    // ]);

    //   var r = this.add.curve(400, 300, curve);
    //   r.setStrokeStyle(2, 0xff0000);



    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const clickedTile = map.getTileAtWorldXY(
        pointer.worldX,
        pointer.worldY,
        true,
        this.cameras.main,
        layer
      );
      console.log('clickedTile', clickedTile)
      const playerTile = map.getTileAtWorldXY(
        this.player.getContainer().x,
        this.player.getContainer().y,
        true
      );
      console.log('playerTile', playerTile)

      const returnvalue = easystar.findPath(
        playerTile.x,
        playerTile.y,
        clickedTile.x,
        clickedTile.y,
        (points: Array<{ x: number; y: number }>) => {
          if (!points) {
            return
          }
          const newPoints = points.map(point => map.getTileAt(point.x, point.y))
            .filter(tile => !!tile)
            .map(tile => ([tile.getCenterX(this.cameras.main), tile.getCenterY(this.cameras.main)]))

          this.player.setMovePoints(newPoints)

          // const graphics = this.add.graphics();
          // spline.draw(graphics, 64);

          // var r = this.add.curve(this.container.x, this.container.y, spline);
          // r.setOrigin(this.container.x, this.container.y)

          // console.log("path", path);
        }
      );
      easystar.calculate();
      console.log("returnvalue", returnvalue);
    });

    this.cameras.main.startFollow(this.player.getContainer(), true, 0.08, 0.08);
    this.cameras.main.setZoom(1);
    console.log('getGrid(map.getTilesWithin())', getGrid(map.getTilesWithin()))
    easystar.setGrid(getGrid(map.getTilesWithin()))
    easystar.setAcceptableTiles([9]);
    // easystar.enableDiagonals();
    easystar.enableSync();
    // this.textures.addCanvas
    // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // this.cameras.main.setScroll(95, 100);
    // @ts-ignore
  }

  update() {
    this.player.update(cursors)
  }

}
