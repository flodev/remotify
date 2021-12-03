import { gql } from '@apollo/client'

const SPRITE = `
sprite {
  name
  settings
  url
  animations {
    key
    settings
    frames
    type
  }
}
`

const GAMEOBJECT_TYPE = `
gameobjectype {
  id
  name
  sprite_id
  ${SPRITE}
  settings
}
`

const PLAYER_PROPERTIES = `
id
tile
username
firstname
is_audio_video_enabled
${SPRITE}
animation
is_online
`

export const getClientWithRoomsAndPlayers = gql`
  query GetClientWithRoomsAndPlayers {
    client {
      id
      name
      share_id
      rooms {
        id
        name
        tile
        players {
          ${PLAYER_PROPERTIES}
        }
        gameobjects {
          id
          type_id
          ${GAMEOBJECT_TYPE}
          tile
          settings
          animation
        }
      }
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

export const subscribeToPlayersOfRoom = gql`
  subscription SubscribeToPlayers($room_id: uuid!) {
    player(where: { room_id: { _eq: $room_id } }) {
      ${PLAYER_PROPERTIES}
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
      ${PLAYER_PROPERTIES}
    }
  }
`

export const subscribeToGameObjectsOfRoom = gql`
  subscription SubscribeToGameObjectsOfRoom($room_id: uuid!) {
    gameobject(where: { room_id: { _eq: $room_id } }) {
      id
      type_id
      ${GAMEOBJECT_TYPE}
      room_id
      tile
      player_id
      settings
      animation
    }
  }
`

export const subscribeToRoom = gql`
  subscription SubscribeToRoom($room_id: uuid!) {
    room(where: { id: { _eq: $room_id } }) {
      id
      name
      tile
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

export const changePlayerPosition = gql`
  mutation ChangePlayerPosition($id: uuid!, $tile: json) {
    update_player_by_pk(pk_columns: { id: $id }, _set: { tile: $tile }) {
      id
    }
  }
`

export const changePlayerUsername = gql`
  mutation ChangePlayerUsername($id: uuid!, $username: String) {
    update_player_by_pk(
      pk_columns: { id: $id }
      _set: { username: $username }
    ) {
      id
    }
  }
`

export const changeAudioVideoEnabled = gql`
  mutation ChangePlayerAudioVideoEnabled($id: uuid!, $is_enabled: Boolean) {
    update_player_by_pk(
      pk_columns: { id: $id }
      _set: { is_audio_video_enabled: $is_enabled }
    ) {
      id
    }
  }
`

export const updatePlayer = gql`
  mutation UpdatePlayer($id: uuid!, $object: player_set_input!) {
    update_player_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
    }
  }
`

export const changeRoomTile = gql`
  mutation ChangeRoomTile($id: uuid!, $tile: json) {
    update_room_by_pk(pk_columns: { id: $id }, _set: { tile: $tile }) {
      id
    }
  }
`

export const changeRoom = gql`
  mutation ChangeRoom($id: uuid!, $object: room_set_input!) {
    update_room_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
    }
  }
`

export const upsertGameObject = gql`
  mutation UpsertGameObject($object: gameobject_insert_input!) {
    insert_gameobject_one(
      object: $object
      on_conflict: {
        constraint: gameobject_pkey
        update_columns: [room_id, tile, settings, type_id]
      }
    ) {
      id
    }
  }
`

export const changeGameObject = gql`
  mutation ChangeGameObject($id: uuid!, $object: gameobject_set_input!) {
    update_gameobject_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
    }
  }
`

export const deleteGameObjectById = gql`
  mutation DeleteGameObjectById($id: uuid!) {
    delete_gameobject_by_pk(id: $id) {
      id
    }
  }
`

export const activateInteraction = gql`
  mutation UpdateAnimations(
    $playerId: uuid!
    $playerAnimation: String
    $gameObjectId: uuid!
    $gameObjectPlayerId: uuid!
    $gameObjectAnimation: String
    $gameObjectSettings: json
  ) {
    update_player_by_pk(
      pk_columns: { id: $playerId }
      _set: { animation: $playerAnimation }
    ) {
      id
    }
    update_gameobject_by_pk(
      pk_columns: { id: $gameObjectId }
      _set: {
        animation: $gameObjectAnimation
        player_id: $gameObjectPlayerId
        settings: $gameObjectSettings
      }
    ) {
      id
    }
  }
`
export * from './client'
export * from './jwtCache'
export * from '@apollo/client'
