import { makeObservable, observable, action } from 'mobx'

export class GameStore {
  public isEditMode: boolean = false

  constructor() {
    makeObservable(this, {
      isEditMode: observable,
      setIsEditMode: action,
    })
  }

  setIsEditMode = (isEditMode: boolean) => {
    this.isEditMode = isEditMode
  }
}
