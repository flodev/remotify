import EventEmitter from 'eventemitter3'
import { GameObject, Player, Settings } from '@remotify/models'

export enum InteractionEvents {
  onInteract = 'onInteract',
  onDisengage = 'onDisengage',
}

export type Interaction = { player?: Player; gameObject: GameObject<Settings> }

export class InteractionObserver extends EventEmitter {
  private players: Player[] = []
  private gameObjects: GameObject<Settings>[] = []
  public updatePlayers(players: Player[]) {
    this.players = players
  }
  public updateGameObjects(gameObjects: GameObject<Settings>[]) {
    gameObjects.forEach((gameObject) => {
      const existingGameObject = this.gameObjects.find(
        (existingGameObject) => existingGameObject.id === gameObject.id
      )
      if (existingGameObject) {
        this.checkIfObjectHasInteraction(gameObject, existingGameObject)
      } else {
        this.checkIfNewObjectHasInteraction(gameObject)
      }
    })
    this.gameObjects = gameObjects
  }

  private checkIfNewObjectHasInteraction(gameObject: GameObject<Settings>) {
    if (gameObject.player_id) {
      const player = this.getPlayerById(gameObject.player_id)
      if (player) {
        this.emit(InteractionEvents.onInteract, { player, gameObject })
      } else {
        this.emit(InteractionEvents.onDisengage, { gameObject })
      }
    }
  }

  private checkIfObjectHasInteraction(
    gameObject: GameObject<Settings>,
    existingGameObject: GameObject<Settings>
  ) {
    if (gameObject.player_id && !existingGameObject.player_id) {
      const player = this.getPlayerById(gameObject.player_id)
      if (player) {
        this.emit(InteractionEvents.onInteract, { player, gameObject })
      } else {
        this.emit(InteractionEvents.onDisengage, { gameObject })
      }
    }
    if (!gameObject.player_id && !!existingGameObject.player_id) {
      const player = this.getPlayerById(existingGameObject.player_id)
      this.emit(InteractionEvents.onDisengage, {
        player,
        gameObject,
      })
    }
  }

  private getPlayerById(id: string) {
    return this.players.find((player) => player.id === id)
  }
}
