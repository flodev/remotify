import { makeObservable, observable, action } from 'mobx'
import { Player } from '@remotify/models'
import { ApolloClient, subscribeToPlayersOfRoom } from '@remotify/graphql'

export class PlayerStore {
  public players: Player[] = []

  constructor(
    private graphQl: ApolloClient<any>,
    private userId: string,
    private roomId: string,
    public player: Player
  ) {
    makeObservable(this, {
      players: observable,
      player: observable,
      _listenForPlayerUpdates: action,
    })
    this._listenForPlayerUpdates()
  }

  public _listenForPlayerUpdates() {
    this.graphQl
      .subscribe<{ player: Player[] }>({
        query: subscribeToPlayersOfRoom,
        variables: { room_id: this.roomId },
      })
      .subscribe(
        ({ data }) => {
          if (data?.player) {
            this.players = data.player
            const foundPlayer = this.players.find(
              (player) => player.id === this.userId
            )
            if (!foundPlayer) {
              throw new Error('player not found')
            }
            this.player = foundPlayer
          }
        },
        (error) => {
          console.log('on error', error)
        }
      )
  }
}
