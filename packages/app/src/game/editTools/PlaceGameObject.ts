import { RoomScene } from '../scenes/room'
import { Draggable } from '../utils'
import {
  GAME_OBJECT_DATA_KEY_ID,
  ListenerFunction,
  PhaserGameObject,
  PhaserGameObjectPlacable,
  PlaceGameObjectConfig,
  TypeToDataId,
} from '../gameobjects'
import { PlaceObject, TILE_WIDTH } from '../gameobjects'

import { Input } from 'phaser'
import { TILE_ID_FREE_PLACE, TILE_ID_OCCUPIED } from '../utils/tileIds'
import { getSettingsByType } from '../../models'

type Pointer = Input.Pointer
const PhaserEvents = Input.Events

export class PlaceGameObject extends Draggable implements PlaceObject {
  scene?: RoomScene
  draggableGameObject?: PhaserGameObjectPlacable
  highlightedTiles: { tile: Phaser.Tilemaps.Tile; defaultTint: number }[] = []
  dropTile?: Phaser.Tilemaps.Tile
  newObjectPlacedListener?: ListenerFunction

  constructor(private config: PlaceGameObjectConfig) {
    super()
  }

  start(scene: RoomScene): void {
    this.scene = scene
    this.registerEvents()
    this.scene.input.on(PhaserEvents.GAMEOBJECT_DOWN, this.onGameOjectDown)
    this.scene.input.on(PhaserEvents.GAMEOBJECT_UP, this.onGameObjectUp)
  }

  stop(): void {
    this.unregisterEvents()
    this.resetTiles()
    this.scene?.input.off(PhaserEvents.GAMEOBJECT_DOWN, this.onGameOjectDown)
    this.scene?.input.off(PhaserEvents.GAMEOBJECT_UP, this.onGameObjectUp)
    this.newObjectPlacedListener = undefined
    this.draggableGameObject = undefined
    this.scene = undefined
    this.dropTile = undefined
  }

  public onNewObjectPlaced(newObjectPlacedListener: ListenerFunction): void {
    this.newObjectPlacedListener = newObjectPlacedListener
  }

  protected dragStop = (): void => {
    console.log('drag stop', this.dropTile, this.draggableGameObject)
    if (this.draggableGameObject && this.dropTile) {
      console.log('drag stop1')
      this.positionGameObject()
      this.occupyTiles()
      this.newObjectPlacedListener &&
        this.newObjectPlacedListener(
          this.draggableGameObject,
          this.highlightedTiles.map((tile) => ({
            x: tile.tile.x,
            y: tile.tile.y,
          }))
        )
      this.resetTiles()
      this.scene?.recreateEasystarGrid()
      this.scene?.updateRoomTile()
    }
    this.draggableGameObject = undefined
    this.dropTile = undefined
  }

  protected drag = (pointer: Pointer): void => {
    this.resetTiles()
    if (!this.draggableGameObject) {
      throw new Error('no game object found')
    }
    this.draggableGameObject.x = pointer.worldX
    this.draggableGameObject.y = pointer.worldY
    this.dropTile = this.getDropTile(pointer)
    this.highlightTiles(pointer)
  }

  protected dragStart = (pointer: Pointer): void => {
    if (!this.draggableGameObject) {
      this.draggableGameObject = this.createGameObject(
        pointer.worldX,
        pointer.worldY
      )
    } else {
      this.unOccupyTiles(this.draggableGameObject)
    }
  }

  protected resetTiles() {
    this.highlightedTiles.forEach(
      ({ tile, defaultTint }) => (tile.tint = defaultTint)
    )
    this.highlightedTiles = []
  }

  protected highlightTiles(pointer: Pointer) {
    const tiles = this.getTiles(pointer)

    if (tiles.length === 0) {
      console.log('no tile found to highlight')
      return
    }

    this.highlightedTiles = tiles.map((tile) => ({
      defaultTint: tile.tint,
      tile,
    }))
    this.highlightedTiles.forEach(({ tile }) => (tile.tint = 0xe100fd))
  }

  protected getTiles(pointer: Pointer): Phaser.Tilemaps.Tile[] {
    if (!this.dropTile) {
      console.error('cannot find drop tile')
      return []
    }
    const tileCountHorizontal = this.config.occupiedTilesCount.horizontal
    if (tileCountHorizontal % 2 > 0) {
      const tilesBefore = this.getAdjacentTiles(
        Math.floor(tileCountHorizontal / 2),
        pointer,
        'left'
      )
      const tilesAfter = this.getAdjacentTiles(
        tileCountHorizontal - Math.ceil(tileCountHorizontal / 2),
        pointer,
        'right'
      )
      return [...tilesBefore, this.dropTile, ...tilesAfter]
    }
    return [
      ...this.getAdjacentTiles(
        Math.floor(tileCountHorizontal / 2),
        pointer,
        'left'
      ),
      this.dropTile,
    ]
  }

  protected unOccupyTiles = (gameObject: PhaserGameObject) => {
    const map = this.scene?.getMap()
    if (!map) {
      console.error('map not found')
      return
    }
    const occupiedTiles = gameObject.getModel().settings?.occupiedTiles
    if (Array.isArray(occupiedTiles)) {
      occupiedTiles.forEach((tile) => {
        map?.putTileAt(TILE_ID_FREE_PLACE, tile.x, tile.y)
      })
    }
  }

  protected occupyTiles() {
    const map = this.scene?.getMap()
    this.highlightedTiles.forEach((tile) => {
      console.log('putting tiles')
      map?.putTileAt(TILE_ID_OCCUPIED, tile.tile.x, tile.tile.y)
    })
  }

  protected positionGameObject() {
    if (!this.draggableGameObject) {
      throw new Error('no game object, cannot position game object.')
    }
    if (!this.dropTile) {
      throw new Error('no drop tile, cannot position game object.')
    }
    this.draggableGameObject.x = this.dropTile.getCenterX(
      this.scene?.cameras.main
    )
    this.draggableGameObject.y =
      this.dropTile.getCenterY(this.scene?.cameras.main) +
      this.draggableGameObject.getYOffset()
  }

  protected onGameOjectDown = (
    _pointer: Pointer,
    gameobject: PhaserGameObjectPlacable
  ) => {
    const id = TypeToDataId[this.config.type.name]
    if (gameobject.getData(GAME_OBJECT_DATA_KEY_ID) === id) {
      console.log('using existing gameobject as draggable object')
      this.draggableGameObject = gameobject
    }
  }

  protected onGameObjectUp = () => {
    if (!this.isDragStarted) {
      this.draggableGameObject = undefined
    }
  }

  private getAdjacentTiles(
    count: number,
    pointer: Pointer,
    direction: 'left' | 'right'
  ) {
    const map = this.scene?.getMap()
    const tiles = []
    let currentX = pointer.worldX
    for (let i = 0; i < count; i++) {
      if (direction === 'left') {
        currentX -= TILE_WIDTH
      } else {
        currentX += TILE_WIDTH
      }
      const tile = map?.getTileAtWorldXY(
        currentX,
        pointer.worldY + (this.draggableGameObject?.getYOffset() || 0)
      )
      if (tile) {
        tiles.push(tile)
      }
    }
    return tiles
  }

  private getDropTile(pointer: Pointer) {
    const map = this.scene?.getMap()
    return map?.getTileAtWorldXY(
      pointer.worldX,
      pointer.worldY + (this.draggableGameObject?.getYOffset() || 0)
    )
  }

  private createGameObject(x: number, y: number) {
    const gameObject = this.config.gameObjectFactory.create({
      room_id: this.config.roomId,
      tile: { x, y },
      type_id: this.config.type.id,
      gameobjectype: this.config.type,
      settings: getSettingsByType(this.config.type.name, { occupiedTiles: [] }),
    })
    if (!gameObject) {
      throw new Error('not able to create game object sprite')
    }
    return gameObject
  }
}
