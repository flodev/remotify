import 'antd/dist/antd.css';
import './App.css';
import React, {useEffect} from 'react';
import {HoveringControls, Game, PrivateRoute} from '../components'
import {initiateGame} from '../../game/phaser'
import {createClient} from '../../graphql/createClient'
import axios from 'axios'
import { gql, useSubscription, ApolloProvider } from '@apollo/client';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { TempRegister } from '../components/TempRegister';

const client = createClient()


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

export const App = () => {
  // useEffect(() => {
  //   (async function() {
  //     let token = localStorage.getItem('token')
  //     if (!token) {
  //       const response = await axios.post('http://localhost:8081/temp-signup', {
  //         username: 'temporary',
  //         password: "temporary"
  //       })
  //       token = response.data.token
  //       if (token) {
  //         localStorage.setItem('token', token)
  //       }
  //     }

  //     const response = await client.query({query})
  //     console.log('response', response)
  //   }())

  //   // initiateGame()
  // })
  return (
    <Router>
      <ApolloProvider client={client}>
        <Switch>
          <Route path="/signup">
            <TempRegister />
          </Route>
          <PrivateRoute path="/">
            <Game />
          </PrivateRoute>
        {/* <HoveringControls /> */}
        </Switch>
      </ApolloProvider>
    </Router>
  );
}

