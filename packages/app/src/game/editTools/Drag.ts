import { EditToolType } from './index'
import { ToolbarTool } from './ToolbarTool'
import { Input } from 'phaser'
const PhaserEvents = Input.Events

export class Drag implements ToolbarTool {
  private isMoving: boolean = false
  private previousPointer?: { x: number; y: number }
  private camera?: Phaser.Cameras.Scene2D.Camera
  private scene?: Phaser.Scene

  start(scene: Phaser.Scene): void {
    this.scene = scene
    this.scene.input.on(PhaserEvents.POINTER_DOWN, this.dragStart)
    this.scene.input.on(PhaserEvents.POINTER_UP, this.dragStop)
    this.scene.input.on(PhaserEvents.POINTER_MOVE, this.drag)
    this.camera = this.scene.cameras.main
  }
  drag = (pointer: Phaser.Input.Pointer) => {
    if (!this.isMoving) {
      return
    }
    if (!this.previousPointer) {
      this.previousPointer = {
        x: pointer.x,
        y: pointer.y,
      }
    }

    this.centerCameraOnDelta(pointer)
  }

  private centerCameraOnDelta(pointer: Phaser.Input.Pointer) {
    const deltaX = this.previousPointer!.x - pointer.x
    const deltaY = this.previousPointer!.y - pointer.y

    this.camera?.centerOn(
      this.camera?.worldView.centerX + deltaX,
      this.camera?.worldView.centerY + deltaY
    )
    this.previousPointer = { x: pointer.x, y: pointer.y }
  }
  dragStart = (pointer: Phaser.Input.Pointer) => {
    // this.previousPointer = {
    //   x: pointer.x,
    //   y: pointer.y,
    // }
    this.isMoving = true
  }
  dragStop = () => {
    this.previousPointer = undefined
    this.isMoving = false
    console.log('dragstop')
  }
  stop(): void {
    this.scene?.input.off(PhaserEvents.POINTER_UP, this.dragStart)
    this.scene?.input.off(PhaserEvents.POINTER_DOWN, this.dragStop)
    this.scene?.input.off(PhaserEvents.POINTER_MOVE, this.drag)
    this.isMoving = false
    this.previousPointer = undefined
    this.scene = undefined
    this.camera = undefined
  }
}
