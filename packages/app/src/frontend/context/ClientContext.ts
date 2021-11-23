import React from 'react'
import { Client, GameObjectType, Player } from '@remotify/models'
export const ClientContext = React.createContext<{
  client?: Client
  gameObjectTypes: GameObjectType[]
  player?: Player
}>({
  client: undefined,
  gameObjectTypes: [],
  player: undefined,
})
