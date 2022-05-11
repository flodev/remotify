import { makeObservable, observable, action } from 'mobx'

export class GameStore {
  public isEditMode: boolean = false
  public isRoomView: boolean = false
  public game?: Phaser.Game = undefined

  constructor() {
    makeObservable(this, {
      isRoomView: observable,
      isEditMode: observable,
      game: observable.ref,
      setIsEditMode: action,
      setIsRoomView: action,
      setGame: action,
    })
  }

  setIsEditMode = (isEditMode: boolean) => {
    this.isEditMode = isEditMode
  }

  setIsRoomView = (isRoomView: boolean) => {
    this.isRoomView = isRoomView
  }

  setGame = (game: Phaser.Game) => {
    this.game = game
  }
}
