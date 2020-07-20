import React, { FunctionComponent, useEffect } from 'react'
import { initiateGame } from '../../../game/phaser'
import { HoveringControls } from '../HoveringControls'
import { useQuery, gql, useApolloClient } from '@apollo/client'
import { ClientContext } from '../../app/ClientContext'

const query = gql`
query MyQuery {
  client {
    id
    name
    share_id
    rooms {
      id
      name
      players {
        id
        firstname
      }
    }
  }
}`
interface GameProps {
}


export const Game: FunctionComponent<GameProps> = () => {
  const {loading, data} = useQuery(query)
  const apolloClient = useApolloClient()

  useEffect(() => {
    if (!loading) {
      initiateGame(apolloClient)
    }
  }, [loading])
  return (
    <ClientContext.Provider value={{client: data && data.client && data.client[0]}}>
      <HoveringControls/>
    </ClientContext.Provider>
  )
}
