import { Scene } from 'phaser'
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { getClientWithRoomsAndPlayers } from '../../graphql'
import { RoomScene } from './room'

export class RootScene extends Scene {
  public async create() {
    const graphQl = this.registry.get('graphQl') as ApolloClient<InMemoryCache>
    const result = await graphQl.query({ query: getClientWithRoomsAndPlayers })
    const roomScene = new RoomScene({ key: 'room' }, result.data.client)
    this.scene.add('room', roomScene, true)
  }
}