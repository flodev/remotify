import { Room } from "./room"

export interface Client {
  id: string
  name: string
  share_id: string
  rooms: Room[]
}
