import { makeObservable, observable, action, reaction } from 'mobx'
import { Player } from '@remotify/models'
import {
  ApolloClient,
  getPlayersOfRoom,
  subscribeToPlayersOfRoom,
} from '@remotify/graphql'
import { ApiInterface } from '@remotify/open-api'

export class PlayerStore {
  public player?: Player
  public players: Player[] = []
  /**
   * - players who are online
   * - does not include current player
   */
  public otherOnlinePlayers: Player[] = []
  private subscription?: { unsubscribe(): void }

  constructor(
    private userId: string,
    private roomId: string,
    private api: ApiInterface
  ) {
    makeObservable(this, {
      players: observable.ref,
      player: observable,
      otherOnlinePlayers: observable,
      setPlayers: action,
      setPlayer: action,
      setOtherOnlinePlayers: action,
    })
  }

  public updatePlayerOnline = async (isOnline: boolean) => {
    try {
      await this.api.updatePlayer({
        object: {
          is_online: isOnline,
        },
        id: this.userId,
      })
    } catch (e) {
      console.error('update player failed', e)
    }
  }

  public listenForPlayerUpdates = () => {
    this.subscription = this.api.listenForPlayerUpdates(
      this.roomId,
      (players) => {
        this.setPlayers(players)
        const player = players.find(({ id }) => id === this.userId)
        this.setOtherOnlinePlayers(
          players.filter(
            ({ id, is_online }) => id !== this.userId && is_online === true
          )
        )
        if (player) {
          this.setPlayer(player)
        } else {
          console.error('cannot find current player in players ;(', players)
        }
      }
    )
  }

  public setPlayers = (players: Player[]) => {
    this.players = players
  }

  public setOtherOnlinePlayers = (players: Player[]) => {
    console.log('setting other online players', players)
    this.otherOnlinePlayers = players
  }

  public setPlayer = (player: Player) => {
    console.log('setting player', player)
    this.player = player
  }

  public destruct() {
    this.subscription?.unsubscribe()
  }
}
