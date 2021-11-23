import { Cameras, Tilemaps } from 'phaser'

export const convertTileToWorldCoords = (
  tileCoords: { x: number; y: number },
  map: Tilemaps.Tilemap,
  camera: Cameras.Scene2D.Camera
) => {
  const tile = map.getTileAt(tileCoords.x, tileCoords.y)
  if (!tile) {
    return undefined
  }
  return {
    x: tile.getCenterX(camera),
    y: tile.getCenterY(camera),
  }
}
