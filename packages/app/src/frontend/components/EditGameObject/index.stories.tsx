import { Form } from 'antd'
import React from 'react'
import { useState } from 'react'
import { ComponentDecorator } from '../../../../.storybook/decorators'
import { PlaceObjectsTypes } from '../../../game/gameobjects'
import { Player } from '@remotify/models'
import { DeskForm } from './DeskForm'
import { EditGameObjectModal } from './EditGameObjectModal'

const players: Player[] = [
  {
    id: '1',
    username: 'flo1',
    firstname: 'floo',
    is_online: true,
    is_audio_video_enabled: false,
    tile: { x: 1, y: 1 },
    sprite: {
      id: '2323',
      name: 'string',
      url: 'string',
      settings: {
        frameHeight: 10,
        frameWidth: 10,
      },
    },
  },
  {
    id: '2',
    username: 'flo2',
    firstname: 'floo',
    is_online: true,
    is_audio_video_enabled: false,
    tile: { x: 1, y: 1 },
    sprite: {
      id: '2323',
      name: 'string',
      url: 'string',
      settings: {
        frameHeight: 10,
        frameWidth: 10,
      },
    },
  },
  {
    id: '3',
    username: 'flo3',
    firstname: 'floo',
    is_online: true,
    is_audio_video_enabled: false,
    tile: { x: 1, y: 1 },
    sprite: {
      id: '2323',
      name: 'string',
      url: 'string',
      settings: {
        frameHeight: 10,
        frameWidth: 10,
      },
    },
  },
]

export default {
  title: 'EditGameObject',
  decorators: [ComponentDecorator],
}

export const Default = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [form] = Form.useForm()
  return (
    <EditGameObjectModal
      onFinish={() => {}}
      gameObjectType={PlaceObjectsTypes.Desk}
      form={form}
      onClose={() => {}}
      onDelete={() => {}}
      onCancel={() => setIsVisible(false)}
      isVisible={isVisible}
    >
      <DeskForm
        players={players}
        form={form}
        deskSettings={{
          occupiedTiles: [],
          ownerId: players[1].id,
        }}
      />
    </EditGameObjectModal>
  )
}

export const DeskDefault = () => {
  const [form] = Form.useForm()
  return (
    <DeskForm
      players={players}
      form={form}
      deskSettings={{
        occupiedTiles: [],
        ownerId: players[1].id,
      }}
    />
  )
}
