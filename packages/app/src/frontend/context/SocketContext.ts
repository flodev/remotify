import React from 'react'
import { connect } from 'socket.io-client'

export const socket = connect(process.env.WEBRTC_SOCKET as string)
export const SocketContext = React.createContext(socket)
