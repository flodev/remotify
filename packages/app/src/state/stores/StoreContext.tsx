import { ApolloClient } from '@remotify/graphql'
import React, { createContext, useContext, useMemo } from 'react'

import { PlayerStore } from './PlayerStore'
import { GameObjectStore } from './GameObjectStore'
import { GameStore } from './GameStore'
import { UserMediaStore } from './UserMediaStore'
import { ClientStore, RoomStore } from '.'
import { Api, ApiInterface } from '@remotify/open-api'

export interface StoreContextProps {
  roomId: string
  userId: string
  graphQl: ApolloClient<any>
  api: ApiInterface
}

export interface AppContextProps extends StoreContextProps {
  children: React.ReactNode | React.ReactNode[]
}

export class Stores {
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
    this.playerStore.listenForPlayerUpdates()
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

export const StoreContext = createContext<Stores | undefined>(undefined)

export const StoreContextProvider = (props: AppContextProps) => {
  const value = useMemo(() => new Stores(props), [])
  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  )
}

export const useStoreContext = (): Stores => {
  const context = useContext(StoreContext)
  if (!context) {
    throw Error('Application context is not ready')
  }
  return context
}
