import {ClientStore} from './ClientStore'

export class RootStore {
  public readonly clientStore: ClientStore
  constructor() {
    this.clientStore = new ClientStore(this)
  }
}