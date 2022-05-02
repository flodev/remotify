import { makeObservable, observable, action } from 'mobx'
import { GameObject, GameObjectType, Settings } from '@remotify/models'
import {
  ApolloClient,
  subscribeToGameObjectsOfRoom,
  getGameObjectsByRoomId,
} from '@remotify/graphql'
import { ApiInterface } from '@remotify/open-api'

export class GameObjectStore {
  public gameObjects: GameObject<Settings>[] = []
  public gameObjectTypes: GameObjectType[] = []

  constructor(private api: ApiInterface, private roomId: string) {
    console.log('init game object store')
    this._listenForGameObjectChange()
    this.fetchGameObjectTypes()
    makeObservable(this, {
      gameObjects: observable.ref,
      gameObjectTypes: observable.ref,
      setGameObjects: action,
      setGameObjectTypes: action,
    })
  }

  public fetchGameObjectTypes = async () => {
    try {
      const gameObjectTypes = await this.api.getGameObjectTypes()
      this.setGameObjectTypes(gameObjectTypes)
    } catch (e) {
      console.error('cannot fetch', e)
      throw new Error('cannot fetch game object types')
    }
  }

  public _listenForGameObjectChange() {
    this.api.listenForGameObjectChange(this.roomId, this.setGameObjects)
  }

  public setGameObjects = (gameObjects: GameObject<Settings>[]) => {
    this.gameObjects = gameObjects
  }

  public setGameObjectTypes = (gameObjectTypes: GameObjectType[]) => {
    this.gameObjectTypes = gameObjectTypes
  }
}
