import EventEmitter from 'eventemitter3'
import { Input } from 'phaser'
import { FONT_DEFAULT } from '../../constants'
import {
  DeskInteractions,
  GameObjectInteractions,
  ToiletInteractions,
} from '../../models'
import { GAME_OBJECT_DATA_KEY_ID, GAME_OBJECT_ID_MENU } from '../gameobjects'

export interface InteractionMenuEntry {
  name: string
  text: string
}

export interface InteractionMenuConfig {
  scene: Phaser.Scene
  x: number
  y: number
  entries: InteractionMenuEntry[]
  zIndex: number
}

export interface MenuListener {
  (entry: InteractionMenuEntry): void
}
export interface CloseListener {
  (): void
}

const ENTRY_HEIGHT = 30
const ENTRY_WIDTH = 100

export class InteractionMenu extends EventEmitter {
  containers: Phaser.GameObjects.Container[] = []
  closeButton!: Phaser.GameObjects.Container
  constructor(private config: InteractionMenuConfig) {
    super()
    this.createCloseButton()
    this.buildMenu()
    setTimeout(() =>
      this.config.scene.input.on(Input.Events.POINTER_DOWN, this.onPointerDown)
    )
  }

  private onPointerDown = (
    pointer: Input.Pointer,
    elements: Phaser.GameObjects.GameObject[]
  ) => {
    const item = elements.find(
      (element) =>
        element.data.get(GAME_OBJECT_DATA_KEY_ID) === GAME_OBJECT_ID_MENU
    )
    if (!item) {
      this.close()
    }
  }

  private createCloseButton() {
    const { scene, x, y } = this.config
    this.closeButton = scene.add.container(x - 50, y - 50)
    this.closeButton.setSize(50, 50)
    this.closeButton.setDepth(100)
    this.closeButton.setInteractive()
    this.closeButton.on(Input.Events.POINTER_DOWN, () => this.close())
    this.closeButton.add(
      scene.add.arc(0, 0, 25, undefined, undefined, undefined, 0xcccccc)
    )
    this.closeButton.add(scene.add.text(0, 0, 'X', { color: 'black' }))
  }

  private buildMenu() {
    const { entries, scene, x, y, zIndex } = this.config
    let currentY = y
    entries.forEach((entry) => {
      const container = scene.add.container(x, currentY)
      container.setDepth(zIndex)
      container.setDataEnabled()
      container.data.set(GAME_OBJECT_DATA_KEY_ID, GAME_OBJECT_ID_MENU)
      container.setSize(ENTRY_WIDTH, ENTRY_HEIGHT)
      container.setInteractive()
      container.on(Input.Events.POINTER_DOWN, () =>
        this.emit('itemclick', entry)
      )
      // container.input.gameObject.on('pointerdown', () => console.log('hallo'))
      container.add(
        scene.add.rectangle(0, 0, ENTRY_WIDTH, ENTRY_HEIGHT, 0x000000)
      )
      container.add(
        scene.add.rectangle(0, 1, ENTRY_WIDTH, ENTRY_HEIGHT + 1, 0xcccccc)
      )
      container.add(
        scene.add.text(ENTRY_WIDTH / -2, 0, entry.text, {
          color: 'black',
          font: FONT_DEFAULT,
          align: 'left',
          fixedWidth: ENTRY_WIDTH,
          padding: { left: 5 },
        })
      )
      currentY += ENTRY_HEIGHT
      this.containers.push(container)
    })
  }

  public close() {
    this.containers.forEach((container) => container.destroy())
    this.closeButton.destroy()
    this.off('itemclick')
    this.emit('close')
    this.off('close')
    this.config.scene.input.off(Input.Events.POINTER_DOWN, this.onPointerDown)
  }

  onItemClick(listener: MenuListener) {
    this.on('itemclick', listener)
  }

  onClose(listener: CloseListener) {
    this.on('close', listener)
  }
}
