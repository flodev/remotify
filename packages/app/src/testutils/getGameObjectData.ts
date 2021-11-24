import { PlaceObjectsTypes } from '../game/gameobjects'
import { GameObject, Settings } from '../models'

export const getGameObjectData = (
  gameObject: Partial<GameObject<Settings>> = {}
): GameObject<Settings> => ({
  id: '1',
  type_id: '1',
  room_id: '121',
  settings: {
    occupiedTiles: [],
  },
  tile: {
    x: 1,
    y: 1,
  },
  gameobjectype: {
    sprite_id: '1',
    id: '1',
    name: PlaceObjectsTypes.Desk,
    settings: {
      occupiedTilesCount: {
        vertical: 1,
        horizontal: 1,
      },
      interactionPosition: {
        x: -1,
        y: 0,
      },
    },
    sprite: {
      id: '1',
      name: 'sprite',
      settings: {
        frameHeight: 10,
        frameWidth: 10,
      },
      url: 'sprite',
    },
  },
  ...gameObject,
})
