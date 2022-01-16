import { makeObservable, observable, action } from 'mobx'
import { ApiInterface } from '@remotify/open-api'
import { Client } from '@remotify/models'

export class ClientStore {
  public client?: Client

  constructor(private api: ApiInterface) {
    this.fetchClient()
    makeObservable(this, {
      client: observable,
      setClient: action,
    })
  }

  fetchClient = async () => {
    try {
      const client = await this.api.getClientWithRoomsAndPlayers()
      if (!client || !Array.isArray(client) || client.length === 0) {
        console.error('client', client)
        throw new Error('invalid response')
      }
      this.setClient(client[0])
    } catch (e) {
      console.error('cannot fetch client', e)
    }
  }

  setClient = (client: Client) => {
    this.client = client
  }
}
