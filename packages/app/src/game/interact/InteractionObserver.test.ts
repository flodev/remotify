import {
  Interaction,
  InteractionEvents,
  InteractionObserver,
} from './InteractionObserver'
import { getGameObjectData, getPlayerData } from '../../testutils'

describe('InteractionObserver', () => {
  test('notifies on new interaction', () => {
    const interactionObserver = new InteractionObserver()
    let hasBeenCalled = false
    interactionObserver.on(
      InteractionEvents.onInteract,
      (interaction: Interaction) => {
        expect(interaction.player?.id).toEqual('1')
        expect(interaction.gameObject.id).toEqual('1')
        hasBeenCalled = true
      }
    )
    interactionObserver.updatePlayers([getPlayerData({ id: '1' })])
    interactionObserver.updateGameObjects([
      getGameObjectData({ id: '1', player_id: '1' }),
    ])
    expect(hasBeenCalled).toBeTruthy()
  })

  test('notifies on disengange', () => {
    const interactionObserver = new InteractionObserver()
    let hasBeenCalled = false
    interactionObserver.on(
      InteractionEvents.onDisengage,
      (interaction: Interaction) => {
        expect(interaction.player?.id).toEqual('1')
        expect(interaction.gameObject.id).toEqual('1')
        hasBeenCalled = true
      }
    )
    interactionObserver.updatePlayers([getPlayerData({ id: '1' })])
    interactionObserver.updateGameObjects([
      getGameObjectData({ id: '1', player_id: '1' }),
    ])
    interactionObserver.updateGameObjects([
      getGameObjectData({ id: '1', player_id: undefined }),
    ])
    expect(hasBeenCalled).toBeTruthy()
  })

  test('notifies on disengange if player is not there (e.g. left the', () => {
    const interactionObserver = new InteractionObserver()
    let hasBeenCalled = false
    interactionObserver.on(
      InteractionEvents.onDisengage,
      (interaction: Interaction) => {
        expect(interaction.gameObject.id).toEqual('1')
        hasBeenCalled = true
      }
    )
    interactionObserver.updatePlayers([getPlayerData({ id: '1' })])
    interactionObserver.updatePlayers([])
    interactionObserver.updateGameObjects([
      getGameObjectData({ id: '1', player_id: '1' }),
    ])
    expect(hasBeenCalled).toBeTruthy()
  })
})
