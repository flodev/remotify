import { Point } from '.'
import { DeskAnimations, GameObjectType, Sprite } from '.'
import { PlaceObjectsType, PlaceObjectsTypes } from './placeObjectType'

export type OccupiedTile = { x: number; y: number }

export interface DeskSettings extends Settings {
  ownerId?: string
}
export interface ToiletSettings extends Settings {
  content?: ToiletContent
}
export enum ToiletContent {
  pee = 'pee',
  dump = 'dump',
}

export const getSettingsByType = (
  type: PlaceObjectsType,
  settings: Settings
) => {
  switch (type) {
    case PlaceObjectsTypes.Toilet:
      return { ...settings }
    default:
      return settings
  }
}

export type Settings = {
  occupiedTiles: OccupiedTile[]
}
export interface GameObject<S extends Settings> {
  id?: string
  gameobjectype: GameObjectType
  type_id: string
  room_id: string
  tile: Point
  settings: S
  animation?: string
  player_id?: string
}
