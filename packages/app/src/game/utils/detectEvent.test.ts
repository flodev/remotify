import { EventEmitter } from 'eventemitter3'
import { Input } from 'phaser'
import { DetectedEvent, detectEvent, MOVEMENT_THRESHOLD } from './detectEvent'
jest.useFakeTimers()

describe('detect event', () => {
  const initX = 100
  const initY = 100
  const emitter = new EventEmitter()
  const pointer = {
    x: initX,
    y: initY,
    camera: {
      scene: {
        input: emitter,
      },
    },
  } as unknown as Input.Pointer

  afterEach(() => {
    emitter.removeAllListeners()
  })
  it('should detect drag on movement X', (done) => {
    detectEvent(pointer, (event: DetectedEvent) => {
      expect(event).toEqual(DetectedEvent.Drag)
      done()
    })
    emitter.emit(Input.Events.POINTER_MOVE, {
      x: initX + MOVEMENT_THRESHOLD + 1,
    })
  })
  it('should detect drag on movement Y', (done) => {
    detectEvent(pointer, (event: DetectedEvent) => {
      expect(event).toEqual(DetectedEvent.Drag)
      done()
    })
    emitter.emit(Input.Events.POINTER_MOVE, {
      y: initY + MOVEMENT_THRESHOLD + 1,
    })
  })
  it('should detect drag on time', (done) => {
    detectEvent(pointer, (event: DetectedEvent) => {
      expect(event).toEqual(DetectedEvent.Drag)
      done()
    })
    jest.runAllTimers()
  })
  it('should detect click', async (done) => {
    detectEvent(pointer, (event: DetectedEvent) => {
      expect(event).toEqual(DetectedEvent.Click)
      done()
    })
    jest.advanceTimersByTime(500)
    emitter.emit(Input.Events.POINTER_UP, { x: initX, y: initY })
  })
})
