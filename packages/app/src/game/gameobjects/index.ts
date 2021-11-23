export * from '../player'
export * from './gameObjectIds'
export * from './gameObjectDataKeys'
export * from './assetNames'
export * from './GameObjectUpdatable'
export * from './GameObjectsUpdater'
export * from './Factory'
export * from './Desk'
export * from './Toilet'
import {
  GameObject,
  GameObjectType,
  OccupiedTile,
  OccupiedTilesCount,
  Settings,
} from '../../models'
import { ToolbarTool } from '../editTools'
import { GameObjectFactory } from './Factory'
import * as gameObjectIds from './gameObjectIds'
import { GameObjectUpdatable } from './GameObjectUpdatable'

export enum PlaceObjectsTypes {
  Desk = 'desk',
  Toilet = 'toilet',
}

export const TILE_WIDTH = 30

export type PhaserGameObject = (
  | Phaser.GameObjects.Sprite
  | Phaser.GameObjects.Container
) &
  GameObjectUpdatable<GameObject<Settings>>

export type PlaceObjectCompatible = {
  getYOffset(): number
}

export type PhaserGameObjectPlacable = PhaserGameObject & PlaceObjectCompatible

export type ListenerFunction = (
  gameObject: PhaserGameObject,
  occupiedTiles: OccupiedTile[]
) => void

export interface PlaceObject extends ToolbarTool {
  onNewObjectPlaced(listenerFunction: ListenerFunction): void
}

export type PlaceObjectsType =
  | undefined
  | PlaceObjectsTypes.Desk
  | PlaceObjectsTypes.Toilet

export const TypeToDataId: {
  [key: string]: string
} = {
  [PlaceObjectsTypes.Desk]: gameObjectIds.GAME_OBJECT_ID_DESK,
  [PlaceObjectsTypes.Toilet]: gameObjectIds.GAME_OBJECT_ID_TOILET,
}

export type PlaceGameObjectConfig = {
  gameObjectFactory: GameObjectFactory
  type: GameObjectType
  roomId: string
  occupiedTilesCount: OccupiedTilesCount
}
