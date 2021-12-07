import { makeObservable, observable, action } from 'mobx'
import { GameObject, GameObjectType, Settings } from '@remotify/models'
import {
  ApolloClient,
  subscribeToGameObjectsOfRoom,
  getGameObjectsByRoomId,
} from '@remotify/graphql'
import { Api } from '@remotify/open-api'

export class GameObjectStore {
  public gameObjects: GameObject<Settings>[] = []
  public gameObjectTypes: GameObjectType[] = []

  constructor(
    private graphQl: ApolloClient<any>,
    private api: Api,
    private roomId: string
  ) {
    console.log('init game object store')
    this._listenForGameObjectChange()
    this.fetchGameObjectTypes()
    makeObservable(this, {
      gameObjects: observable,
      gameObjectTypes: observable.ref,
      setGameObjects: action,
      setGameObjectTypes: action,
    })
  }

  public async fetchGameObjectTypes() {
    try {
      this.gameObjectTypes = await this.api.getGameObjectTypes()
    } catch (e) {
      console.error('cannot fetch', e)
      throw new Error('cannot fetch game object types')
    }
  }

  public _listenForGameObjectChange() {
    this.graphQl
      .subscribe<{ gameobject: { id: string } }>({
        query: subscribeToGameObjectsOfRoom,
        variables: { room_id: this.roomId },
      })
      .subscribe(
        async ({ data }) => {
          console.log('got updated gameobjects', data)
          try {
            const gameObjects = await this.graphQl.query<{
              gameobject: GameObject<Settings>[]
            }>({
              query: getGameObjectsByRoomId,
              variables: {
                roomId: this.roomId,
              },
            })
            if (gameObjects?.data?.gameobject) {
              this.setGameObjects(gameObjects.data.gameobject)
            }
          } catch (e) {
            console.log('cannot receive game objects by room id', e)
          }
        },
        (error) => {
          console.error('on error', error)
        }
      )
  }

  public setGameObjects = (gameObjects: GameObject<Settings>[]) => {
    this.gameObjects = gameObjects
  }

  public setGameObjectTypes = (gameObjectTypes: GameObjectType[]) => {
    this.gameObjectTypes = gameObjectTypes
  }
}