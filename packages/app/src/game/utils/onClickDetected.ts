import Phaser from 'phaser'
import { Input } from 'phaser'
import { Point } from '@remotify/models'
const PhaserEvents = Input.Events

const MILLISECONDS_THRESHOLD = 1000
const MOVEMENT_THRESHOLD = 30

export type OnClickDetectedListener<T> = (
  pointer: Phaser.Input.Pointer,
  gameObject: T
) => void

export type UnsubscribeFunction = () => void

export const onClickDetected = <T extends Phaser.Events.EventEmitter>(
  gameObject: T,
  listener: OnClickDetectedListener<T>
) => {
  let isGameObjectDown = false
  let milliseconds = 0
  let intervalId: number | undefined
  let initialPoint: Point = { x: 0, y: 0 }

  const gameObjectDown = (pointer: Phaser.Input.Pointer) => {
    initialPoint = { x: pointer.x, y: pointer.y }
    intervalId = window.setInterval(() => (milliseconds += 4), 4)
    isGameObjectDown = true
  }
  const gameObjectUp = (pointer: Phaser.Input.Pointer, gameObject: T) => {
    if (!isGameObjectDown) {
      return
    }
    if (intervalId) {
      clearInterval(intervalId)
    }
    if (isClick(pointer)) {
      listener(pointer, gameObject)
    }

    isGameObjectDown = false
    intervalId = undefined
    milliseconds = 0
  }

  const isClick = (pointer: Phaser.Input.Pointer) => {
    return (
      (Math.abs(initialPoint.x - pointer.x) < MOVEMENT_THRESHOLD &&
        Math.abs(initialPoint.y - pointer.y) < MOVEMENT_THRESHOLD) ||
      milliseconds < MILLISECONDS_THRESHOLD
    )
  }
  gameObject.on(PhaserEvents.POINTER_DOWN, gameObjectDown)
  gameObject.on(PhaserEvents.POINTER_UP, gameObjectUp)

  const unsubscribe: UnsubscribeFunction = () => {
    gameObject.off(PhaserEvents.POINTER_DOWN, gameObjectDown)
    // gameObject.off(PhaserEvents.POINTER_MOVE, pointermove)
    gameObject.off(PhaserEvents.POINTER_UP, gameObjectUp)
  }
  return unsubscribe
}
