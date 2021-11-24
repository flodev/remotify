import { GameObjectUpdatable, PhaserGameObject, PlaceObjectsTypes } from '.'
import { DeskSettings, GameObject, Settings } from '../../models'
import { CreateObjectFromModel } from '../CreateObjectFromModel'
import { GameObjectsUpdater } from './GameObjectsUpdater'
import { FakeGameObject, getGameObjectData } from '../../testutils'

class MockFactory
  implements CreateObjectFromModel<GameObject<Settings>, PhaserGameObject> {
  create(gameObjectModel: GameObject<Settings>): PhaserGameObject {
    throw new Error('Method not implemented.')
  }
}

const gameObjectsUpdatable: GameObjectUpdatable<GameObject<DeskSettings>>[] = [
  new FakeGameObject(getGameObjectData()),
  new FakeGameObject(getGameObjectData({ id: '2' })),
]

test('removes and destroys gameobjects', () => {
  const test = new GameObjectsUpdater(new MockFactory())
  const spy = jest.spyOn(gameObjectsUpdatable[0], 'destroy')
  gameObjectsUpdatable.forEach((gameObject) => test.addGameObject(gameObject))
  test.update([getGameObjectData({ id: '2' })])

  expect(spy).toHaveBeenCalled()
  spy.mockRestore()
})
