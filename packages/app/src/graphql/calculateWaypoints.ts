import { Cameras, Tilemaps } from 'phaser'
import { Point } from '@remotify/models'

export type calculateWaypoints = (
  targetPoint: Point,
  currentPoint: Point
) => Array<number[]>

export const initCalculateWaypoints = (
  camera: Cameras.Scene2D.Camera,
  map: Tilemaps.Tilemap,
  easystar: any
): calculateWaypoints => {
  return (targetPoint, currentPoint) => {
    const currentTile = map.getTileAtWorldXY(currentPoint.x, currentPoint.y)
    const targetTile = map.getTileAtWorldXY(targetPoint.x, targetPoint.y)
    let newPoints: Array<number[]> = []

    easystar.findPath(
      currentTile.x,
      currentTile.y,
      targetTile.x,
      targetTile.y,
      (points: Array<Point>) => {
        if (!points) {
          return
        }
        newPoints = points
          .map((point) => map.getTileAt(point.x, point.y))
          .filter((tile) => !!tile)
          .map((tile) => [tile.getCenterX(camera), tile.getCenterY(camera)])

        // const graphics = this.add.graphics();
        // spline.draw(graphics, 64);

        // var r = this.add.curve(this.container.x, this.container.y, spline);
        // r.setOrigin(this.container.x, this.container.y)

        // console.log("path", path);
      }
    )
    easystar.calculate()
    return newPoints
  }
}
