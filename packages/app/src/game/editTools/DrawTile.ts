import { RoomScene } from '../scenes/room'
import { EditToolType } from './index'
import { ToolbarTool } from './ToolbarTool'
import { Input } from 'phaser'
const PhaserEvents = Input.Events
export class DrawTile implements ToolbarTool {
  private scene?: RoomScene
  private isStarted: boolean = false

  constructor(private tileId: number) {}

  start(scene: RoomScene): void {
    this.scene = scene
    this.scene.input.on(PhaserEvents.POINTER_DOWN, this.dragStart)
    this.scene.input.on(PhaserEvents.POINTER_UP, this.dragStop)
    this.scene.input.on(PhaserEvents.POINTER_MOVE, this.drag)
  }

  private dragStart = (pointer: Phaser.Input.Pointer) => {
    this.isStarted = true
    this.placeTile(pointer)
  }

  private dragStop = () => {
    this.isStarted = false
    this.scene?.recreateEasystarGrid()
    this.scene?.updateRoomTile()
  }

  private drag = (pointer: Phaser.Input.Pointer) => {
    if (this.isStarted) {
      this.placeTile(pointer)
    }
  }

  private placeTile = (pointer: Phaser.Input.Pointer) => {
    const map = this.scene?.getMap()
    const tile = map?.putTileAtWorldXY(
      this.tileId,
      pointer.worldX,
      pointer.worldY
    )
    if (tile) {
      tile.properties = { collides: true }
    }
  }

  stop(): void {
    this.isStarted = false
    this.scene?.input.off(PhaserEvents.POINTER_DOWN, this.dragStart)
    this.scene?.input.off(PhaserEvents.POINTER_UP, this.dragStop)
    this.scene?.input.off(PhaserEvents.POINTER_MOVE, this.drag)
    this.scene = undefined
  }
}
