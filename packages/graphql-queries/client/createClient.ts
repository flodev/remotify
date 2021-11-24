import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { ApolloClient, split, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { JwtCache } from '../jwtCache'

/* local */
// const GRAPHQL_ENDPOINT = "http://127.0.0.1:8001/v1/graphql"
// const GRAPHQL_WS = "ws://127.0.0.1:8001/v1/graphql"
/* home */
// const GRAPHQL_ENDPOINT = "http://192.168.178.72:3234/v1/graphql";
// const GRAPHQL_WS = "ws://192.168.178.72:3234/v1/graphql";
/* cowos */
// const GRAPHQL_ENDPOINT = 'http://192.168.179.116:8001/v1/graphql'
// const GRAPHQL_WS = 'ws://192.168.179.116:8001/v1/graphql'

export const createClient = (
  url: string,
  websocketUrl: string,
  jwtCache: JwtCache
) => {
  const logNotExistingToken = () => {
    if (!jwtCache.has()) {
      console.error('probably malformed graphql authorization, token not found')
    }
  }
  const wsLink = new WebSocketLink({
    uri: websocketUrl as string,
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: () => {
        logNotExistingToken()
        const token = jwtCache.getToken()
        return {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      },
      // connectionParams: {
      //   headers: {
      //     Authorization: `Bearer ${authToken}`
      //   }
      // }
    },
  })

  const httpLink = new HttpLink({
    uri: url,
    // headers: {
    //   Authorization: `Bearer ${authToken}`
    // }
  })

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )

  const authLink = setContext((_, { headers }) => {
    logNotExistingToken()
    // get the authentication token from local storage if it exists
    const token = jwtCache.getToken()
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  })
  const client = new ApolloClient<any>({
    cache: new InMemoryCache(),
    link: authLink.concat(link),
  })
  return client
}
