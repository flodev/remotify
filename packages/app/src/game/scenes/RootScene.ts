import { Scene } from 'phaser'
import { ApolloClient, InMemoryCache } from '@remotify/graphql'
import {
  getClientWithRoomsAndPlayers,
  getGameObjectTypes,
} from '@remotify/graphql'
import { RoomScene } from './room'
import { GameObjectType } from '../../models'
import { Client } from '@remotify/models'
import { REGISTRY_STORE_CONTEXT } from '../../constants'
import { StoreContext } from '../../state'

export class RootScene extends Scene {
  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config)
  }
  public async create() {
    const storeContext = this.registry.get(
      REGISTRY_STORE_CONTEXT
    ) as StoreContext
    const {
      clientStore: { client },
      gameObjectStore: { gameObjectTypes },
    } = storeContext
    if (!client || !gameObjectTypes) {
      throw new Error('insufficient data')
    }
    const roomScene = new RoomScene(
      { key: 'room' },
      {
        clients: [client],
        gameObjectTypes,
      }
    )
    this.scene.add('room', roomScene, true)
  }
}
