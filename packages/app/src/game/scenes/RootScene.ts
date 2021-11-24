import { Scene } from 'phaser'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import {
  getClientWithRoomsAndPlayers,
  getGameObjectTypes,
} from '@remotify/graphql'
import { RoomScene } from './room'
import { GameObjectType } from '../../models'
import { Client } from '@remotify/models'

export class RootScene extends Scene {
  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config)
  }
  public async create() {
    const graphQl = this.registry.get('graphQl') as ApolloClient<InMemoryCache>
    const { data: clients } = await graphQl.query<{ client: Client[] }>({
      query: getClientWithRoomsAndPlayers,
    })
    const { data: gameObjectTypes } = await graphQl.query<{
      gameobject_type: GameObjectType[]
    }>({
      query: getGameObjectTypes,
    })
    const roomScene = new RoomScene(
      { key: 'room' },
      {
        clients: clients.client,
        gameObjectTypes: gameObjectTypes.gameobject_type,
      }
    )
    this.scene.add('room', roomScene, true)
  }
}
