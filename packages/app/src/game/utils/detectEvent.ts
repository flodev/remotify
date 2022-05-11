import { Input } from 'phaser'
import { Point } from '@remotify/models'

export enum DetectedEvent {
  Drag = 'drag',
  Click = 'click',
}

export const MILLISECONDS_THRESHOLD = 1000
export const MOVEMENT_THRESHOLD = 30

export const detectEvent = (
  initialPointer: Input.Pointer,
  callback: (event: DetectedEvent) => void
) => {
  const scene = initialPointer.camera.scene
  let milliseconds = 0
  let intervalId: any
  let initialPoint: Point = { x: initialPointer.x, y: initialPointer.y }

  const reportDrag = () => {
    unregisterEvents()
    callback(DetectedEvent.Drag)
  }
  const reportClick = () => {
    unregisterEvents()
    callback(DetectedEvent.Click)
  }

  intervalId = setInterval(() => {
    milliseconds += 4
    if (milliseconds > MILLISECONDS_THRESHOLD) {
      reportDrag()
    }
  }, 4)

  const isDrag = (pointer: Input.Pointer) => {
    return (
      Math.abs(initialPoint.x - pointer.x) > MOVEMENT_THRESHOLD ||
      Math.abs(initialPoint.y - pointer.y) > MOVEMENT_THRESHOLD ||
      milliseconds > MILLISECONDS_THRESHOLD
    )
  }

  const unregisterEvents = () => {
    if (intervalId) {
      clearInterval(intervalId)
    }
    intervalId = undefined
    scene.input.off(Input.Events.POINTER_MOVE, pointerMove)
    scene.input.off(Input.Events.POINTER_UP, pointerUp)
  }

  const pointerMove = (pointer: Input.Pointer) => {
    if (isDrag(pointer)) {
      reportDrag()
    }
  }
  const pointerUp = (pointer: Input.Pointer) => {
    if (isDrag(pointer)) {
      reportDrag()
    } else {
      reportClick()
    }
  }
  scene.input.on(Input.Events.POINTER_MOVE, pointerMove)
  scene.input.on(Input.Events.POINTER_UP, pointerUp)
}
