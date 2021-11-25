import React, { useContext } from 'react'
import { DeskForm, EditGameObject } from '.'
import { DeskSettings, GameObject } from '../../../models'
import { ClientContext } from '../../context'
import { Form } from 'antd'

interface EditGameObjectDeskProps {
  desk: GameObject<DeskSettings>
  onClose(): void
}

export const EditGameObjectDesk = ({
  onClose,
  desk,
}: EditGameObjectDeskProps) => {
  const [form] = Form.useForm<DeskSettings>()
  const { client } = useContext(ClientContext)

  // @todo: multi room, restructure stuff
  if (!client?.rooms[0]?.players) {
    console.error('cannot render edit game object desk, players not found')
    return <></>
  }
  return (
    <EditGameObject form={form} onClose={onClose} gameObject={desk}>
      <DeskForm
        players={client.rooms[0].players}
        form={form}
        deskSettings={desk.settings}
      />
    </EditGameObject>
  )
}
