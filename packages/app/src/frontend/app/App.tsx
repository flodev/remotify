import 'antd/dist/antd.css'
import '../../i18n'
import React, { useState } from 'react'
import { Init, Setup } from '../components'
// import {RootStore} from '../stores'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { JwtCache } from '@remotify/graphql'

const jwtCache = new JwtCache()

export const App = () => {
  const [canOpenGame, setCanOpenGame] = useState(false)

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

  // return (
  //   <Router>
  //     {/* <Provider rootStore={new RootStore()}> */}
  //     <SocketContext.Provider value={socket}>
  //       <GameStateContext.Provider
  //         value={{
  //           game,
  //           setGame,
  //           isEditMode,
  //           setIsEditMode,
  //           player,
  //           userMediaStream,
  //           setUserMediaStream,
  //           activeEditTool,
  //           setActiveEditTool,
  //           isVideoStreamingReady,
  //           setIsVideoStreamingReady,
  //         }}
  //       >
  //         <ApolloProvider client={client}>
  //           <Switch>
  //             <Route path="/signup">
  //               <TempRegister />
  //             </Route>
  //             <Route path="/invite/:inviteId">
  //               <TempRegister />
  //             </Route>
  //             <PrivateRoute path="/">
  //               <Game />
  //             </PrivateRoute>
  //           </Switch>
  //         </ApolloProvider>
  //         {/* </Provider> */}
  //       </GameStateContext.Provider>
  //     </SocketContext.Provider>
  //   </Router>
  // )
}
