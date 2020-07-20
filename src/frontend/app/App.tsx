import 'antd/dist/antd.css';
import './App.css';
import React, {useEffect} from 'react';
import {HoveringControls, Game, PrivateRoute} from '../components'
import {initiateGame} from '../../game/phaser'
import {createClient} from '../../graphql/createClient'
import axios from 'axios'
import { gql, useSubscription, ApolloProvider } from '@apollo/client';
// import {RootStore} from '../stores'
import {ClientContext} from './ClientContext'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { TempRegister } from '../components/TempRegister';

const client = createClient()

export const App = () => {
  return (
    <Router>
      {/* <Provider rootStore={new RootStore()}> */}
        <ApolloProvider client={client}>
          <Switch>
            <Route path="/signup">
              <TempRegister />
            </Route>
            <Route path="/invite/:inviteId">
              <TempRegister />
            </Route>
            <PrivateRoute path="/">
              <Game />
            </PrivateRoute>
          </Switch>
        </ApolloProvider>
      {/* </Provider> */}
    </Router>
  );
}

