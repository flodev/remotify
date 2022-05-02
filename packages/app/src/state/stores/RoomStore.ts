import { makeObservable, observable, action } from 'mobx'
import { Room } from '@remotify/models'
import { ApiInterface } from '@remotify/open-api'

export class RoomStore {
  public room?: Room

  constructor(private api: ApiInterface, private roomId: string) {
    this._listenRoomChange()
    makeObservable(this, {
      room: observable,
      setRoom: action,
    })
  }

  public _listenRoomChange() {
    this.api.listenForRoomChange(this.roomId, this.setRoom)
  }

  public setRoom = (room: Room) => {
    this.room = room
  }
}
