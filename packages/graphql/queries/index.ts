import { gql } from '@apollo/client'
import {
  GAMEOBJECT_TYPE,
  PLAYER_PROPERTIES,
  ROOM_PROPERTIES,
  SPRITE,
} from '../properties'

export const getClientWithRoomsAndPlayers = gql`
query GetClientWithRoomsAndPlayers {
  client {
    id
    name
    share_id
    rooms {
      ${ROOM_PROPERTIES}
    }
  }
}
`

export const getRoomByPk = gql`
  query ($roomId: uuid!) {
    room_by_pk(id: $roomId) {
      ${ROOM_PROPERTIES}
    }
  }
`

export const getGameObjectTypes = gql`
query GetGameObjectTypes {
  gameobject_type {
    id
    name
    sprite_id
    settings
    ${SPRITE}
  }
}
`

export const getGameObjectsByRoomId = gql`
  query ($roomId: uuid) {
    gameobject(where: { room_id: { _eq: $roomId } }) {
      id
      type_id
      room_id
      tile
      player_id
      settings
      animation
      ${GAMEOBJECT_TYPE}
    }
  }
`

export const getPlayersOfRoom = gql`
query getPlayersOfRoom($roomId: uuid!) {
  player(where: { room_id: { _eq: $roomId } }) {
    ${PLAYER_PROPERTIES}
  }
}
`
