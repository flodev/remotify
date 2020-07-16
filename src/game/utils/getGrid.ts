export const getGrid = (tiles: Phaser.Tilemaps.Tile[]) => {
  const grid: any[] = [];
  let prevY: number = tiles[0].y;
  let col: number[] = [];
  tiles.forEach((tile) => {
    if (tile.y !== prevY) {
      grid.push(col);
      col = [tile.index];
      prevY = tile.y;
    } else {
      col.push(tile.index);
    }
  });

  return grid
}
