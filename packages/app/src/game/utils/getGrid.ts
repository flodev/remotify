export const getGrid = (layer: Phaser.Tilemaps.LayerData) => {
  return layer.data.map((row) => {
    return row.map((col) => {
      return col.index
    })
  })
}
