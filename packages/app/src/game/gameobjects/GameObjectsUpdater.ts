import { CreateObjectFromModel } from '../CreateObjectFromModel'
import { GameObjectUpdatable } from './GameObjectUpdatable'

export type ModelWithId = { id?: string }

type Compare<T extends ModelWithId> = (
  arr1: Array<T>,
  arr2: Array<T>
) => Array<T>

const exclude: Compare<ModelWithId> = (arr1, arr2) =>
  arr1.filter((o1) => !arr2.map((o2) => o2.id).includes(o1.id))

export class GameObjectsUpdater<M extends ModelWithId> {
  private gameObjects: GameObjectUpdatable<M>[] = []

  constructor(
    private factory: CreateObjectFromModel<M, GameObjectUpdatable<M>>
  ) {}

  public update(gameObjectModels: M[]) {
    gameObjectModels.forEach((gameObjectModel) => {
      const existingObject = this.findExistingObject(gameObjectModel)
      if (existingObject) {
        existingObject.updateModel(gameObjectModel)
      } else {
        console.log('creating game object', gameObjectModel)
        this.gameObjects.push(this.factory.create(gameObjectModel))
      }
    })

    const existingGameObjectModels = this.gameObjects
      .map((gameObject) => gameObject.getModel())
      .filter((gameObject) => !!gameObject.id)

    const newGameObjectModels = gameObjectModels.filter(
      (gameObject) => !!gameObject.id
    )

    const modelsToDelete = exclude(
      existingGameObjectModels,
      newGameObjectModels
    )

    this.deleteGameObjects(modelsToDelete)
  }

  private deleteGameObjects(modelsToDelete: ModelWithId[]) {
    modelsToDelete.forEach((model) => {
      const ids = this.gameObjects.map((object) => object.getModel().id!)
      const id = model.id!
      const index = ids.indexOf(id)
      const deleted = this.gameObjects.splice(index, 1)

      deleted.forEach((gameObject) => {
        gameObject.destroy()
      })
    })
  }

  public addGameObject(gameObject: GameObjectUpdatable<M>) {
    const existingGameObject = this.findExistingObject(gameObject.getModel())
    if (existingGameObject) {
      existingGameObject.updateModel(gameObject.getModel())
    } else {
      this.gameObjects.push(gameObject)
    }
  }

  private findExistingObject(gameObjectModel: ModelWithId) {
    return this.gameObjects.find((gameObject) =>
      gameObject.matches(gameObjectModel.id)
    )
  }

  getGameObjects() {
    return this.gameObjects
  }

  findGameObject<T extends GameObjectUpdatable<M>>(id: string): T | undefined {
    return this.gameObjects.find(
      (gameObject) => gameObject.getModel().id === id
    ) as T | undefined
  }
}
