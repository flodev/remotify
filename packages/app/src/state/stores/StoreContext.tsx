import { ApolloClient } from '@remotify/graphql'
import { Client, GameObjectType } from '@remotify/models'
import { Game } from 'phaser'
import React, { createContext, useContext, useMemo } from 'react'

import { PlayerStore } from './PlayerStore'
import { GameStore } from './GameStore'
import { UserMediaStore } from './UserMediaStore'

interface StoreContextProps {
  roomId: string
  userId: string
  graphQl: ApolloClient<any>
  client: Client
  gameObjectTypes: GameObjectType[]
  game?: Game
}

interface AppContextProps extends StoreContextProps {
  children: React.ReactNode[]
}

export class StoreContext {
  readonly playerStore: PlayerStore
  readonly gameStore: GameStore
  readonly userMediaStore: UserMediaStore
  readonly gameObjectTypes: GameObjectType[]
  readonly client: Client
  readonly game?: Game

  constructor(props: StoreContextProps) {
    this.client = props.client
    this.game = props.game
    this.playerStore = new PlayerStore(
      props.graphQl,
      props.userId,
      props.roomId,
      this.client.rooms[0].players.find((player) => player.id === props.userId)!
    )
    this.gameStore = new GameStore()
    this.userMediaStore = new UserMediaStore()
    this.gameObjectTypes = props.gameObjectTypes
  }
}

const Context = createContext<StoreContext | undefined>(undefined)

export const StoreContextProvider = (props: AppContextProps) => {
  const value = useMemo(() => new StoreContext(props), [props.game])
  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export const useStoreContext = (): StoreContext => {
  const context = useContext(Context)
  if (!context) {
    throw Error('Application context is not ready')
  }
  return { ...context }
}
