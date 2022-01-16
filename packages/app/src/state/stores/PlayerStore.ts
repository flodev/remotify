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
    private graphQl: ApolloClient<any>,
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
    this.subscription = this.graphQl
      .subscribe<{ player: Player[] }>({
        query: subscribeToPlayersOfRoom,
        variables: { roomId: this.roomId },
      })
      .subscribe({
        next: async ({ data }) => {
          console.log('got player updates', data)
          if (data?.player) {
            const players = await this.fetchPlayers()
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
        },
        error(error) {
          console.error('on error', error)
        },
      })
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

  private async fetchPlayers(): Promise<Player[]> {
    try {
      const players = await this.graphQl.query<{ player: Player[] }>({
        query: getPlayersOfRoom,
        variables: {
          roomId: this.roomId,
        },
        fetchPolicy: 'no-cache',
      })
      console.log('fetch player result', players)
      return players?.data?.player || []
    } catch (e) {
      console.error('error fetching players', e)
      return []
    }
  }

  public destruct() {
    this.subscription?.unsubscribe()
  }
}
