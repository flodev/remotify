import { gql } from '@apollo/client'
import { PLAYER_PROPERTIES } from '../properties'

export const subscribeToPlayersOfRoom = gql`
  subscription SubscribeToPlayers($roomId: uuid!) {
    player(where: { room_id: { _eq: $roomId } }) {
      id
      is_online
      is_audio_video_enabled
      animation
      username
      tile
    }
  }
`

export const subscribeToOtherOnlinePlayers = gql`
  subscription GetOtherOnlinePlayers($roomId: uuid!, $playerId: uuid!) {
    player(
      where: {
        room_id: { _eq: $roomId }
        is_online: { _eq: true }
        id: { _neq: $playerId }
      }
    ) {
      id
    }
  }
`

export const subscribeToGameObjectsOfRoom = gql`
  subscription SubscribeToGameObjectsOfRoom($room_id: uuid!) {
    gameobject(where: { room_id: { _eq: $room_id } }) {
      id
      tile
      settings
      animation
      player_id
    }
  }
`

export const subscribeToRoom = gql`
  subscription SubscribeToRoom($roomId: uuid!) {
    room(where: { id: { _eq: $roomId } }) {
      id
      tile
      name
    }
  }
`

export const subscribeToPlayerUpdates = gql`
subscription OnPlayerUpdated($id: uuid!) {
  player_by_pk(id: $id) {
    ${PLAYER_PROPERTIES}
  }
}
`
