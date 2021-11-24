import { Input } from 'phaser'
import { whenDrag } from '.'
import { PhaserGameObject } from '../gameobjects'
const PhaserEvents = Input.Events
export abstract class Draggable {
  protected isPointerDown: boolean = false
  protected isDragStarted: boolean = false

  protected abstract scene?: Phaser.Scene
  protected abstract drag(pointer: Phaser.Input.Pointer): void
  protected abstract dragStart(pointer: Phaser.Input.Pointer): void
  protected abstract dragStop(): void

  protected registerEvents() {
    this.scene?.input.on(PhaserEvents.POINTER_DOWN, this.pointerDown)
  }
  protected unregisterEvents() {
    this.scene?.input.off(PhaserEvents.POINTER_DOWN, this.pointerDown)
  }

  protected pointerDown = (
    pointer: Input.Pointer,
    gameObjects?: PhaserGameObject[]
  ) => {
    whenDrag(pointer, () => {
      console.log('when drag')
      this.isDragStarted = true
      this.isPointerDown = true
      this.dragStart(pointer)
      this.scene?.input.on(PhaserEvents.POINTER_MOVE, this.pointerMove)
      this.scene?.input.on(PhaserEvents.POINTER_UP, this.pointerUp)
    })
  }

  protected pointerMove = (pointer: Phaser.Input.Pointer) => {
    if (this.isPointerDown) {
      this.drag(pointer)
    }
  }

  protected pointerUp = () => {
    this.dragStop()
    this.isDragStarted = false
    this.isPointerDown = false
    this.scene?.input.off(PhaserEvents.POINTER_MOVE, this.pointerMove)
    this.scene?.input.off(PhaserEvents.POINTER_UP, this.pointerUp)
  }
}
