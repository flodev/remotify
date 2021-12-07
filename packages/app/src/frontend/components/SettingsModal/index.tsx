import { GameObject, Settings, ToiletSettings } from '@remotify/models'
import { useEffect, useState } from 'react'
import { REGISTRY_IS_SETTINGS_MODAL_OPEN } from '../../../constants'
import { PlaceObjectsTypes } from '../../../game/gameobjects'
import { EVENT_OPEN_GAME_OBJECT_SETTINGS } from '../../app/GameEvents'
import { EditGameObjectDesk, EditGameObjectToilet } from '../EditGameObject'
import { Game } from 'phaser'

interface SettingsModalProps {
  game?: Game
}

export const SettingsModal = ({ game }: SettingsModalProps) => {
  const [gameObjectModel, setGameObjectModel] = useState<GameObject<Settings>>()

  const onClose = () => {
    setGameObjectModel(undefined)
    game?.registry.set(REGISTRY_IS_SETTINGS_MODAL_OPEN, false)
  }

  useEffect(() => {
    if (game) {
      game.events.on(
        EVENT_OPEN_GAME_OBJECT_SETTINGS,
        (gameObject: GameObject<Settings>) => {
          setGameObjectModel({ ...gameObject })
          console.log('gameObject', gameObject)
          game.registry.set(REGISTRY_IS_SETTINGS_MODAL_OPEN, true)
        }
      )
    }
  }, [game])

  if (
    !!gameObjectModel &&
    gameObjectModel.gameobjectype.name === PlaceObjectsTypes.Desk
  ) {
    return <EditGameObjectDesk desk={gameObjectModel} onClose={onClose} />
  }
  if (
    !!gameObjectModel &&
    gameObjectModel.gameobjectype.name === PlaceObjectsTypes.Toilet
  ) {
    return (
      <EditGameObjectToilet
        toilet={gameObjectModel as GameObject<ToiletSettings>}
        onClose={onClose}
      />
    )
  }
  return <></>
}
