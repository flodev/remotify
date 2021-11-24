import { Animation, Sprite } from '../../models'
import { PhaserGameObject } from '../gameobjects'

export const createAnimations = (
  spriteModel: Sprite,
  gameObject: Phaser.GameObjects.GameObject
) => {
  const { animations } = spriteModel

  const createAnimation = (animation: Animation<unknown>) => {
    gameObject.scene.anims.create({
      key: animation.key,
      frames: gameObject.scene.anims.generateFrameNumbers(spriteModel.name, {
        frames: animation.frames,
      }),
      ...animation.settings,
    })
  }

  if (!Array.isArray(animations)) {
    console.warn('no animations found :*(')
    return
  }
  animations.forEach((animation) => createAnimation(animation))
}
