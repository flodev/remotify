import { Input } from 'phaser'
import { Point } from '@remotify/models'

const MILLISECONDS_THRESHOLD = 1000
const MOVEMENT_THRESHOLD = 30

export const whenDrag = (
  initialPointer: Input.Pointer,
  callback: () => void
) => {
  const scene = initialPointer.camera.scene
  let milliseconds = 0
  let intervalId: number | undefined
  let initialPoint: Point = { x: initialPointer.x, y: initialPointer.y }

  const reportPositiveDrag = () => {
    unregisterEvents()
    callback()
  }

  intervalId = window.setInterval(() => {
    milliseconds += 4
    if (milliseconds > MILLISECONDS_THRESHOLD) {
      reportPositiveDrag()
    }
  }, 4)

  const unregisterEvents = () => {
    if (intervalId) {
      clearInterval(intervalId)
    }
    intervalId = undefined
    scene.input.off(Input.Events.POINTER_MOVE, pointerMove)
    scene.input.off(Input.Events.POINTER_UP, pointerUp)
  }

  const pointerMove = (pointer: Input.Pointer) => {
    if (
      Math.abs(initialPoint.x - pointer.x) > MOVEMENT_THRESHOLD ||
      Math.abs(initialPoint.y - pointer.y) > MOVEMENT_THRESHOLD
    ) {
      reportPositiveDrag()
    }
  }
  const pointerUp = () => {
    unregisterEvents()
  }
  scene.input.on(Input.Events.POINTER_MOVE, pointerMove)
  scene.input.on(Input.Events.POINTER_UP, pointerUp)
}
