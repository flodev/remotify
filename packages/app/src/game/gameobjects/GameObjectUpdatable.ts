import { ModelWithId } from '.'
import { GameObject as GameObjectModel, Settings } from '../../models'

export interface GameObjectUpdatable<M extends ModelWithId> {
  matches(id?: string): boolean
  updateModel(gameObjectModel: M): void
  getModel(): M
  destroy(): void
}
