import { Sprite } from '.'
import { PlaceObjectsTypes } from './placeObjectType'

export type OccupiedTilesCount = { vertical: number; horizontal: number }
export type InteractionPosition = { x: number; y: number }
export interface GameObjectType {
  id: string
  name: PlaceObjectsTypes
  sprite_id: string
  sprite: Sprite
  settings: {
    occupiedTilesCount: OccupiedTilesCount
    /**
     * the position where the user interacts with the game object.
     * this is related to occupied tiles from game object settings.
     * it takes the middle of occupied tiles and subtracts/adds the interaction position value
     * eg: occupiedTiles: [{x: 10, y: 10}, {x: 11, y: 10}, {x: 12, y: 10}]
     * will transform using interaction position {x: 0, y: 1} to
     * [{x: 10, y: 10}, {x: 11, y: 11}, {x: 12, y: 10}]
     */
    interactionPosition: InteractionPosition
  }
}
