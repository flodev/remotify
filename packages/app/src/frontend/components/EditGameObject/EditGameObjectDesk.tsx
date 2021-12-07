import React, { useContext } from 'react'
import { DeskForm, EditGameObject } from '.'
import { DeskSettings, GameObject } from '../../../models'
import { Form } from 'antd'
import { useStoreContext } from '../../../state'

interface EditGameObjectDeskProps {
  desk: GameObject<DeskSettings>
  onClose(): void
}

export const EditGameObjectDesk = ({
  onClose,
  desk,
}: EditGameObjectDeskProps) => {
  const [form] = Form.useForm<DeskSettings>()
  const {
    playerStore: { players },
  } = useStoreContext()

  // @todo: multi room, restructure stuff
  if (!players) {
    console.error('cannot render edit game object desk, players not found')
    return <></>
  }
  return (
    <EditGameObject form={form} onClose={onClose} gameObject={desk}>
      <DeskForm players={players} form={form} deskSettings={desk.settings} />
    </EditGameObject>
  )
}
