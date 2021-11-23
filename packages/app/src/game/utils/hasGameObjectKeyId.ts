import * as gameObjectIds from '../gameobjects/gameObjectIds'
import {
  PhaserGameObject,
  GAME_OBJECT_DATA_KEY_ID,
} from '../../game/gameobjects'

export const hasGameObjectKeyId = (gameObject: PhaserGameObject) => {
  return Object.values(gameObjectIds).includes(
    gameObject.getData(GAME_OBJECT_DATA_KEY_ID)
  )
}
