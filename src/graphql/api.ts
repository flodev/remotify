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