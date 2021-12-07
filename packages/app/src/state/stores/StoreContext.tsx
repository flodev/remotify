import { ApolloClient } from '@remotify/graphql'
import React, { createContext, useContext, useMemo } from 'react'

import { PlayerStore } from './PlayerStore'
import { GameObjectStore } from './GameObjectStore'
import { GameStore } from './GameStore'
import { UserMediaStore } from './UserMediaStore'
import { ClientStore, RoomStore } from '.'
import { Api } from '@remotify/open-api'

interface StoreContextProps {
  roomId: string
  userId: string
  graphQl: ApolloClient<any>
  api: Api
}

interface AppContextProps extends StoreContextProps {
  children: React.ReactNode[]
}

export class StoreContext {
  readonly playerStore: PlayerStore
  readonly gameStore: GameStore
  readonly userMediaStore: UserMediaStore
  readonly roomStore: RoomStore
  readonly gameObjectStore: GameObjectStore
  readonly clientStore: ClientStore

  constructor(props: StoreContextProps) {
    this.playerStore = new PlayerStore(
      props.graphQl,
      props.userId,
      props.roomId,
      props.api
    )
    this.gameStore = new GameStore()
    this.userMediaStore = new UserMediaStore()
    this.gameObjectStore = new GameObjectStore(
      props.graphQl,
      props.api,
      props.roomId
    )
    this.roomStore = new RoomStore(props.graphQl, props.roomId)
    this.clientStore = new ClientStore(props.api)
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
  return context
}
