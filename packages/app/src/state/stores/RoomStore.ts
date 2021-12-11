import { makeObservable, observable, action } from 'mobx'
import { Room } from '@remotify/models'
import { ApolloClient, getRoomByPk, subscribeToRoom } from '@remotify/graphql'

export class RoomStore {
  public room?: Room

  constructor(private graphQl: ApolloClient<any>, private roomId: string) {
    this._listenRoomChange()
    makeObservable(this, {
      room: observable,
      setRoom: action,
    })
  }

  public _listenRoomChange() {
    this.graphQl
      .subscribe<{ gameobject: { id: string } }>({
        query: subscribeToRoom,
        variables: { roomId: this.roomId },
      })
      .subscribe(
        async ({ data }) => {
          console.log('room update', data)
          try {
            const room = await this.graphQl.query<{
              room_by_pk: Room
            }>({
              query: getRoomByPk,
              variables: {
                roomId: this.roomId,
              },
              fetchPolicy: 'no-cache',
            })
            if (room?.data?.room_by_pk) {
              this.setRoom(room.data.room_by_pk)
            }
          } catch (e) {
            console.log('cannot receive game objects by room id', e)
          }
        },
        (error) => {
          console.error('on error', error)
        }
      )
  }

  public setRoom = (room: Room) => {
    this.room = room
  }
}
