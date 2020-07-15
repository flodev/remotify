import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import {ApolloClient, split, HttpLink, InMemoryCache} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const GRAPHQL_ENDPOINT = 'http://10.111.181.201/v1/graphql'

export const createClient = () =>  {
  const wsLink = new WebSocketLink({
    uri: `ws://10.111.181.201/v1/graphql`,
    options: {
      reconnect: true,
      connectionParams: () => {
        const token = localStorage.getItem('token')
        return {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          }
        }
      }
      // connectionParams: {
      //   headers: {
      //     Authorization: `Bearer ${authToken}`
      //   }
      // }
    }
  });

  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    // headers: {
    //   Authorization: `Bearer ${authToken}`
    // }
  });

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );


  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });
  return new ApolloClient<any>({
    cache: new InMemoryCache(),
    link: authLink.concat(link),
  })
}