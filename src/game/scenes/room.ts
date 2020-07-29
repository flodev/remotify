import Phaser, { GameObjects, Tilemaps } from "phaser";
import { setDebugPoint } from "../utils/setDebugPoint";
import { Player } from "../gameobjects/player";
import { getGrid } from "../utils/getGrid";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { subscribeClientWithRoomsAndPlayers, changePlayerPosition, calculateWaypoints } from "../../graphql";
import {
  TILE_ID_FREE_PLACE
} from '../utils/tileIds'
var easystarjs = require("easystarjs");
var easystar = new easystarjs.js();
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;


const getPosition = (player: any, otherPlayers: any[], map: Phaser.Tilemaps.Tilemap, camera: Phaser.Cameras.Scene2D.Camera) => {
  if (player.tile !== null) {
    const tile = map.getTileAt(player.tile.x, player.tile.y)
    return {
      x: tile.getCenterX(camera), y: tile.getCenterY(camera)
    }
  }
  const possibleTiles = map.filterTiles((tile: Phaser.Tilemaps.Tile) => tile.index === TILE_ID_FREE_PLACE)
  const availableTiles = possibleTiles.filter(tile =>
    otherPlayers.filter(otherPlayer => otherPlayer.tile.x === tile.x && otherPlayer.tile.y === tile.y).length === 0
  )
  const tile = availableTiles[0]
  return {
    x: tile.getCenterX(camera), y: tile.getCenterY(camera)
  }
}

export class RoomScene extends Phaser.Scene {
  private player: Player
  private otherPlayerGameObjects: Player[] = []
  private map?: Tilemaps.Tilemap
  private layer?: Tilemaps.DynamicTilemapLayer

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig, private client: any) {
    super(config)
    this.player = new Player(this, localStorage.getItem('userId') as string)
    console.log('initial client', client)
  }

  preload() {
    this.load.tilemapTiledJSON("room-map", "assets/tilemaps/room.json");
    this.load.image("roomi", "assets/tilemaps/tilemap.png");
    this.player.load()
  }

  hasPositionChanged(playerData: any, player: Player) {
    if (!this.map) {
      throw new Error('map is undefined')
    }
    const updatedTile = this.map.getTileAt(playerData.tile.x, playerData.tile.y)
    const currentTile = this.map.getTileAtWorldXY(player.getCurrentTargetPoint().x!, player.getCurrentTargetPoint().y!)
    return updatedTile !== currentTile
  }

  async create() {
    const graphQl = this.registry.get('graphQl') as ApolloClient<InMemoryCache>
    const tileMapData = this.client[0]?.rooms[0]?.tile
    const currentUserId = localStorage.getItem('userId')
    const players = this.client[0]?.rooms[0]?.players || []
    const currentPlayer = players.filter((player: any) => player.id === currentUserId)[0]
    const otherPlayers = players.filter((player: any) => player.id !== currentUserId)

    graphQl.subscribe({ query: subscribeClientWithRoomsAndPlayers })
      .subscribe(({ data }) => {
        console.log('subscribe fired')
        const newOtherPlayers = (data?.client[0]?.rooms[0]?.players || []).filter((player: any) => player.id !== currentUserId)
        newOtherPlayers.forEach(otherPlayer => {
          const player = this.otherPlayerGameObjects.filter(player => player.id === otherPlayer.id)[0]
          if (!player) {
            return this.otherPlayerGameObjects!.push(this.createOtherPlayer(otherPlayer))
          }
          if (this.hasPositionChanged(otherPlayer, player)) {
            const currentTile = this.map!.getTileAtWorldXY(player.getCurrentTargetPoint().x!, player.getCurrentTargetPoint().y!)
            player.setMovePoints(calculateWaypoints(otherPlayer.tile, currentTile, this.cameras.main, this.map!, easystar))
            return
          }
        })
      })

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

    this.map = this.make.tilemap({
      tileWidth: 30,
      tileHeight: 30,
      data: tileMapData
    });

    const tileset = this.map.addTilesetImage("room", "roomi", 30, 30, 0, 0, 0);
    tileset.firstgid = 1
    this.layer = this.map.createDynamicLayer(0, tileset, 0, 0);

    // this.map.putTileAt(1, 0, 0);
    this.layer.setCollision([1, 2, 3, 4, 5, 6, 7, 8])
    // this.layer.setCollisionByProperty({ collides: true });
    // this.layer.setCollision(1);

    // this.layer.tilemap.putTileAt(, 10, 10);
    this.map.putTileAt(1, 10, 10);

    const tile = this.map.getTileAt(10, 10);
    tile.properties = { collides: true };
    // playerMask = getMask(this);
    // playerImage.setMask(playerMask);
    const position = getPosition(currentPlayer, otherPlayers, this.map, this.cameras.main)
    const positionTile = this.map.getTileAtWorldXY(position.x, position.y)
    this.updateCurrentPlayerPosition(currentPlayer, positionTile)
    this.player.setConfig({ position })
    await this.player.spawn()

    this.otherPlayerGameObjects = otherPlayers.map(player => this.createOtherPlayer(player))

    this.physics.world.enable(this.player.getContainer());
    this.physics.add.collider(this.player.getContainer(), this.layer);


    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const clickedTile = this.map!.getTileAtWorldXY(
        pointer.worldX,
        pointer.worldY,
        true,
        this.cameras.main,
        this.layer
      );
      const playerTile = this.map!.getTileAtWorldXY(
        this.player.getContainer().x,
        this.player.getContainer().y,
        true
      );

      graphQl.mutate({
        mutation: changePlayerPosition,
        variables: {
          id: localStorage.getItem('userId'),
          tile: { x: clickedTile.x, y: clickedTile.y }
        }
      })
      const newPoints = calculateWaypoints(clickedTile, playerTile, this.cameras.main, this.map!, easystar)
      this.player.setMovePoints(newPoints)
    });

    this.cameras.main.startFollow(this.player.getContainer(), true, 0.08, 0.08);
    this.cameras.main.setZoom(1);
    easystar.setGrid(getGrid(this.map.getTilesWithin()))
    easystar.setAcceptableTiles([9]);
    // easystar.enableDiagonals();
    easystar.enableSync();
    // this.textures.addCanvas
    // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // this.cameras.main.setScroll(95, 100);
    // @ts-ignore
  }

  updateCurrentPlayerPosition(currentPlayer: any, positionTile: Tilemaps.Tile) {
    const graphQl = this.registry.get('graphQl') as ApolloClient<InMemoryCache>
    if (!currentPlayer.tile || positionTile.x !== currentPlayer.tile.x && positionTile.y !== currentPlayer.tile.y) {
      graphQl.mutate({
        mutation: changePlayerPosition,
        variables: {
          id: currentPlayer.id,
          tile: { x: positionTile.x, y: positionTile.y }
        }
      })
    }
  }

  createOtherPlayer(player: any) {
    const otherPlayer = new Player(this, player.id)
    const tile = this.map!.getTileAt(player.tile.x, player.tile.y)
    const position = {
      x: tile.getCenterX(this.cameras.main), y: tile.getCenterY(this.cameras.main)
    }
    otherPlayer.setConfig({ position, data: player })
    otherPlayer.spawn()
    this.map?.getLayer()
    this.physics.world.enable(otherPlayer.getContainer());
    this.physics.add.collider(otherPlayer.getContainer(), this.layer!);
    return otherPlayer
  }

  update() {
    this.player.update(cursors)
    this.otherPlayerGameObjects.forEach(player => player.update(cursors))
  }

}
