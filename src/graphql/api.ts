import { gql } from "@apollo/client";

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
        id
        tile
        firstname
      }
    }
  }
}`

export const changePlayerPosition = gql`
mutation ChangePlayerPosition($id: uuid!, $tile: json) {
  update_player_by_pk(pk_columns: {id: $id}, _set: {tile: $tile}) {
    id
  }
}
`