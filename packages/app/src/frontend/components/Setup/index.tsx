import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useApolloClient,
  useSubscription,
} from '@remotify/graphql'
import React, { useEffect, useState } from 'react'
import { GameLoader, Init, FullPageLoader } from '..'
import { createClient, JwtCache } from '@remotify/graphql'
import { Api } from '@remotify/open-api'
import { EditToolType } from '../../../game/editTools'
import { ApiContext, socket, SocketContext } from '../../context'
import { Router } from 'react-router'

interface SetupProps {
  jwtCache: JwtCache
}

export const Setup = ({ jwtCache }: SetupProps) => {
  const [api, setApi] = useState<Api | undefined>()
  // const [client, setClient] = useState<ApolloClient<any> | undefined>(undefined)
  const client = createClient(
    process.env.REACT_APP_GRAPH_QL_URL!,
    process.env.REACT_APP_GRAPH_QL_WS!,
    jwtCache
  )
  const [canOpenGame, setCanOpenGame] = useState(false)

  useEffect(() => {
    if (!api) {
      setApi(new Api(process.env.REACT_APP_AUTH_API_URL!, client, jwtCache))
    }
  }, [setApi, api])

  if (!canOpenGame && api) {
    return (
      <Init setCanOpenGame={setCanOpenGame} jwtCache={jwtCache} api={api} />
    )
  }

  if (!api) {
    return <FullPageLoader />
  }

  return (
    <SocketContext.Provider value={socket}>
      <ApiContext.Provider
        value={{
          api,
        }}
      >
        <ApolloProvider client={client}>
          <GameLoader />
        </ApolloProvider>
      </ApiContext.Provider>
    </SocketContext.Provider>
  )
}
