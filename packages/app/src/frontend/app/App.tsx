import 'antd/dist/antd.css'
import '../../i18n'
import React, { useState } from 'react'
import { Init, Setup } from '../components'
// import {RootStore} from '../stores'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { JwtCache } from '@remotify/graphql'

const jwtCache = new JwtCache()

export const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/invite/:inviteId">
          <Init jwtCache={jwtCache} isInvite={true} />
        </Route>
        <Route path="/">
          <Setup jwtCache={jwtCache} />
        </Route>
      </Switch>
    </Router>
  )
}
