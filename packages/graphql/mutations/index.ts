import { gql } from '@apollo/client'

// ------------ mutations ------------

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
