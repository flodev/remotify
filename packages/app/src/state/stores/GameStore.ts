import { makeObservable, observable, action } from 'mobx'

export class GameStore {
  public isEditMode: boolean = false
  public game?: Phaser.Game = undefined

  constructor() {
    makeObservable(this, {
      isEditMode: observable,
      game: observable.ref,
      setIsEditMode: action,
      setGame: action,
    })
  }

  setIsEditMode = (isEditMode: boolean) => {
    this.isEditMode = isEditMode
  }

  setGame = (game: Phaser.Game) => {
    this.game = game
  }
}
