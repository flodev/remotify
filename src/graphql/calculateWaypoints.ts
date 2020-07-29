import { Cameras, Tilemaps } from "phaser";


export const calculateWaypoints = (targetTile: any, currentTile: any, camera: Cameras.Scene2D.Camera, map: Tilemaps.Tilemap, easystar: any) => {
  let newPoints: [] = []
  const returnvalue = easystar.findPath(
    currentTile.x,
    currentTile.y,
    targetTile.x,
    targetTile.y,
    (points: Array<{ x: number; y: number }>) => {
      if (!points) {
        return
      }
      newPoints = points.map(point => map.getTileAt(point.x, point.y))
        .filter(tile => !!tile)
        .map(tile => ([tile.getCenterX(camera), tile.getCenterY(camera)]))



      // const graphics = this.add.graphics();
      // spline.draw(graphics, 64);

      // var r = this.add.curve(this.container.x, this.container.y, spline);
      // r.setOrigin(this.container.x, this.container.y)

      // console.log("path", path);
    }
  );
  easystar.calculate();
  return newPoints
}