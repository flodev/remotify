import { GameObject, Settings } from '../models'

export class FakeGameObject {
  constructor(private model: GameObject<Settings>) {}
  getModel(): GameObject<Settings> {
    return this.model
  }
  matches(id: string): boolean {
    return true
  }
  getYOffset() {
    return 0
  }
  updateModel(model: GameObject<Settings>) {}
  destroy() {}
}
