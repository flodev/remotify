import React, { useContext, useState } from 'react'
import { FormInstance, message } from 'antd'
import { PlaceObjectsTypes } from '../../../game/gameobjects'
import { EditGameObjectModal } from './EditGameObjectModal'
import { ApiContext } from '../../context'
import { DeskSettings, GameObject, OccupiedTile } from '../../../models'
import { EVENT_FREE_OCCUPIED_TILES } from '../../app/GameEvents'
import { useStoreContext } from '../../../state'

interface EditGameObjectDeskProps {
  gameObject: GameObject<DeskSettings>
  children?: React.ReactChild
  onClose(): void
  form: FormInstance<any>
}

export const EditGameObject = ({
  gameObject,
  onClose,
  children,
  form,
}: EditGameObjectDeskProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const {
    gameStore: { game },
  } = useStoreContext()
  const { api } = useContext(ApiContext)

  const saveData = async (settings: DeskSettings) => {
    try {
      await api!.changeGameObject({
        id: gameObject.id!,
        object: { settings: { ...gameObject.settings, ...settings } },
      })
      setIsVisible(false)
    } catch (e) {
      message.error('cannot save')
      console.error('cannot save', e)
    }
  }

  const onDelete = async () => {
    if (!gameObject.id) {
      message.error('cannot delete')
      return console.error('cannot delete gameObject. id not found')
    }
    try {
      cleanupTiles(gameObject.settings.occupiedTiles)
      api?.deleteGameObjectById({ id: gameObject.id })
      message.success('deleted')
      setIsVisible(false)
    } catch (e) {
      message.error('cannot delete')
      console.error('cannot delete gameObject ' + e)
    }
  }

  const cleanupTiles = (occupiedTiles: OccupiedTile[]) => {
    game?.events.emit(EVENT_FREE_OCCUPIED_TILES, occupiedTiles)
  }

  return (
    <EditGameObjectModal
      gameObjectType={PlaceObjectsTypes.Desk}
      form={form}
      onClose={onClose}
      onDelete={onDelete}
      onCancel={() => setIsVisible(false)}
      isVisible={isVisible}
      onFinish={saveData}
    >
      {!!children ? children : <></>}
    </EditGameObjectModal>
  )
}
