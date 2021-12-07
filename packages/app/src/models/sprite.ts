import { Animation } from './animation'

export interface SpriteSettings {
  frameWidth: number
  frameHeight: number
}

export interface Sprite {
  id: string
  name: string
  settings: SpriteSettings
  url: string
  animations?: Animation<unknown>[]
}
