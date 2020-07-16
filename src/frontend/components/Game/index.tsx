import React, { FunctionComponent, useEffect } from 'react'
import { initiateGame } from '../../../game/phaser'
import { HoveringControls } from '../HoveringControls'
import { useQuery, gql } from '@apollo/client'

const query = gql`
query MyQuery {
  client {
    id
    name
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

  useEffect(() => {
    if (!loading) {
      initiateGame()
    }
  }, [loading])
  return (
    <HoveringControls/>
  )
}
