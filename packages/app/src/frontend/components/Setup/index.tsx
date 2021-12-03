import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useApolloClient,
  useSubscription,
} from '@remotify/graphql'
import React, { useEffect, useState } from 'react'
import { Game, Init, FullPageLoader } from '..'
import { createClient, JwtCache } from '@remotify/graphql'
import { Api } from '@remotify/open-api'
import { EditToolType } from '../../../game/editTools'
import { GameStateContext, socket, SocketContext } from '../../context'
import { Router } from 'react-router'

interface SetupProps {
  jwtCache: JwtCache
}

export const Setup = ({ jwtCache }: SetupProps) => {
  const [game, setGame] = useState<Phaser.Game>()
  const [isEditMode, setIsEditMode] = useState(false)
  const [api, setApi] = useState<Api | undefined>()
  const [isVideoStreamingReady, setIsVideoStreamingReady] = useState(false)
  // const [client, setClient] = useState<ApolloClient<any> | undefined>(undefined)
  const [userMediaStream, setUserMediaStream] = useState<
    MediaStream | undefined
  >(undefined)

  const client = createClient(
    process.env.REACT_APP_GRAPH_QL_URL!,
    process.env.REACT_APP_GRAPH_QL_WS!,
    jwtCache
  )
  const [canOpenGame, setCanOpenGame] = useState(false)

  useEffect(() => {
    if (!api && jwtCache.has()) {
      setApi(new Api(process.env.REACT_APP_AUTH_API_URL!, client, jwtCache))
    }
  }, [jwtCache.has(), setApi, api])

  if (!canOpenGame) {
    return <Init setCanOpenGame={setCanOpenGame} jwtCache={jwtCache} />
  }

  if (!api) {
    return <FullPageLoader />
  }

  return (
    <SocketContext.Provider value={socket}>
      <GameStateContext.Provider
        value={{
          game,
          setGame,
          isEditMode,
          setIsEditMode,
          userMediaStream,
          setUserMediaStream,
          isVideoStreamingReady,
          setIsVideoStreamingReady,
          api,
        }}
      >
        <ApolloProvider client={client}>
          <Game />
        </ApolloProvider>
      </GameStateContext.Provider>
    </SocketContext.Provider>
  )
}
