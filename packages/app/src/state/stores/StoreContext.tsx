import { ApolloClient } from '@remotify/graphql'
import { Client, GameObjectType } from '@remotify/models'
import React, { createContext, useContext, useMemo } from 'react'

import { PlayerStore } from './PlayerStore'

interface StoreContextProps {
  roomId: string
  userId: string
  graphQl: ApolloClient<any>
  client: Client
  gameObjectTypes: GameObjectType[]
}

interface AppContextProps extends StoreContextProps {
  children: React.ReactChild
}

export class StoreContext {
  readonly playerStore: PlayerStore
  readonly gameObjectTypes: GameObjectType[]
  readonly client: Client
  constructor(props: StoreContextProps) {
    this.client = props.client
    this.playerStore = new PlayerStore(
      props.graphQl,
      props.userId,
      props.roomId,
      this.client.rooms[0].players.find((player) => player.id === props.userId)!
    )
    this.gameObjectTypes = props.gameObjectTypes
  }
}

const Context = createContext<StoreContext | undefined>(undefined)

export const StoreContextProvider = (props: AppContextProps) => {
  const value = useMemo(() => new StoreContext(props), [])
  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export const useStoreContext = (): StoreContext => {
  const context = useContext(Context)
  if (!context) {
    throw Error('Application context is not ready')
  }
  return { ...context }
}
