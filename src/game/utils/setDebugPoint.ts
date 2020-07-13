export const setDebugPoint = (phaser: Phaser.Scene, x: number, y: number) => {
  const graphics = phaser.add.graphics();
  graphics.lineStyle(2, 0xffffff, 1);
  graphics.fillStyle(0xffff00, 1);
  graphics.fillCircle(x, y, 8);
}