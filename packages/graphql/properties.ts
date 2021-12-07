export const SPRITE = `
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

export const GAMEOBJECT_TYPE = `
gameobjectype {
  id
  name
  sprite_id
  ${SPRITE}
  settings
}
`

export const PLAYER_PROPERTIES = `
id
tile
username
firstname
is_audio_video_enabled
${SPRITE}
animation
is_online
`

export const ROOM_PROPERTIES = `
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
`
