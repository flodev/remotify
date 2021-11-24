import { TILE_ID_FREE_PLACE, TILE_ID_WALL } from '../utils/tileIds'
import { Drag } from './Drag'
import { DrawTile } from './DrawTile'
import { ToolbarTool } from './ToolbarTool'

export enum EditToolTypes {
  Drag = 'drag',
  DrawWall = 'draw_wall',
  DrawFloor = 'draw_floor',
  PlaceObjects = 'place_objects',
}

export type EditToolType =
  | undefined
  | EditToolTypes.Drag
  | EditToolTypes.DrawWall
  | EditToolTypes.DrawFloor
  | EditToolTypes.PlaceObjects

export class EditToolFactory {
  public static getInstance(
    editToolType: EditToolType
  ): ToolbarTool | undefined {
    switch (editToolType) {
      case EditToolTypes.Drag:
        return new Drag()
      case EditToolTypes.DrawWall:
        return new DrawTile(TILE_ID_WALL)
      case EditToolTypes.DrawFloor:
        return new DrawTile(TILE_ID_FREE_PLACE)
      case EditToolTypes.PlaceObjects:
        return undefined
      default:
        throw new Error('unknown edit tool type ' + editToolType)
    }
  }
}
