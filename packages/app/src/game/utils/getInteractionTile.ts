import Phaser from 'phaser'
import { PhaserGameObject } from '../../game/gameobjects'
import { OccupiedTile } from '../../models'

export const getInteractionTile = (
  gameObject: PhaserGameObject,
  map: Phaser.Tilemaps.Tilemap
): Phaser.Tilemaps.Tile => {
  const {
    settings: { occupiedTiles },
    gameobjectype: {
      settings: { interactionPosition },
    },
  } = gameObject.getModel()
  const middleTileIndex = Math.ceil((occupiedTiles.length - 1) / 2)
  const middleTile = occupiedTiles[middleTileIndex]
  if (!middleTile) {
    throw new Error('tile not found on index' + middleTile)
  }
  const interactionTileCoords: OccupiedTile = {
    x: middleTile.x + interactionPosition.x,
    y: middleTile.y + interactionPosition.y,
  }
  const interactionTile = map.getTileAt(
    interactionTileCoords.x,
    interactionTileCoords.y
  )

  if (!interactionTile) {
    throw new Error(
      'interaction tile not found on coords' + interactionTileCoords.toString()
    )
  }
  return interactionTile!
}
