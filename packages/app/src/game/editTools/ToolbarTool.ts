import Phaser from 'phaser'

export interface ToolbarTool {
  start(scene: Phaser.Scene): void
  stop(): void
}
