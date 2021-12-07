import { useSubscription } from '@remotify/graphql'
import React, { useContext, useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { subscribeToOtherOnlinePlayers } from '@remotify/graphql'
import {
  Player,
  WebrtcConnection,
  WebrtcMessageTypes,
  WebrtcSignalEvents,
  RegisterSignal,
} from '@remotify/models'
import { SocketContext } from '../../context'
import {
  getUserMediaConstraints,
  RtcConnectionPool,
  RtcFactory,
} from '../../utils'
import { useStoreContext } from '../../../state'
import { observer } from 'mobx-react-lite'
import { REGISTRY_PLAYER_MEDIA_STREAM } from '../../../constants'
import { EVENT_RECEIVED_USER_MEDIA_STREAM } from '../../app/GameEvents'

interface WebrtcProps {}
const rtcConnector = new RtcConnectionPool({ rtcFactory: new RtcFactory() })

const Hidden = styled.div`
  display: none;
`

export const Webrtc = observer(({}: WebrtcProps) => {
  const socket = useContext(SocketContext)
  const [isRegisteredOnSocket, setIsRegisteredOnSocket] = useState(false)
  const {
    playerStore: { player, otherOnlinePlayers },
    gameStore: { game },
    userMediaStore: {
      userMediaStream,
      setUserMediaStream,
      setIsVideoStreamingReady,
    },
  } = useStoreContext()

  const onNewCandidate = useCallback(
    async ({
      message,
      senderId,
    }: WebrtcConnection<WebrtcMessageTypes.candidate>) => {
      try {
        console.log('received ice candidate from sender', senderId)
        await rtcConnector.addCandidate(message, senderId)
      } catch (e) {
        console.error('cannot add ice candidate for player', senderId)
        console.error(e)
      }
    },
    []
  )

  const onIceCandidate = useCallback(
    (event: RTCPeerConnectionIceEvent, playerId: string) => {
      console.log('on ice candidate', event.candidate)
      console.log('on ice candidate player???', player)
      if (event.candidate && player) {
        const rtcConnectionMessage: WebrtcConnection<WebrtcMessageTypes.candidate> = {
          message: event.candidate,
          receiverId: playerId,
          senderId: player.id,
          type: WebrtcMessageTypes.candidate,
        }
        console.log('emitting candidate', rtcConnectionMessage)
        socket.emit(WebrtcSignalEvents.candidate, rtcConnectionMessage)
      }
    },
    [player]
  )

  const onNewOffer = useCallback(
    (offer: WebrtcConnection<WebrtcMessageTypes.offer>) => {
      console.log('received offer', offer)
      rtcConnector
        .receiveOffer(offer, userMediaStream)
        .then((answer) => socket.emit(WebrtcSignalEvents.answer, answer))
    },
    [userMediaStream]
  )

  const onNewAnswer = useCallback(
    async ({
      message,
      senderId,
      ...rest
    }: WebrtcConnection<WebrtcMessageTypes.answer>) => {
      try {
        console.log('received answer', senderId)
        await rtcConnector.receiveAnswer(message, senderId, userMediaStream)
      } catch (e) {
        console.error('cannot receive answer', { message, senderId, ...rest })
      }
    },
    [userMediaStream]
  )

  useEffect(() => {
    if (player && !isRegisteredOnSocket) {
      const register: RegisterSignal = {
        id: player.id,
      }
      socket.emit(WebrtcSignalEvents.register, register)
      setIsRegisteredOnSocket(true)
    }
  }, [player, isRegisteredOnSocket, setIsRegisteredOnSocket])

  useEffect(() => {
    if (game) {
      rtcConnector.onRemoteStream((event, playerId) => {
        console.log('got remote stream', playerId)
        console.log('got remote stream', event)
        game.events.emit(
          EVENT_RECEIVED_USER_MEDIA_STREAM,
          event.streams[0],
          playerId
        )
      })
    }
  }, [game])

  useEffect(() => {
    socket.removeAllListeners(WebrtcSignalEvents.newCandidate)
    socket.on(WebrtcSignalEvents.newCandidate, onNewCandidate)
  }, [onNewCandidate])

  useEffect(() => {
    rtcConnector.onIceCandidate(onIceCandidate)
  }, [onIceCandidate])

  const delay = () => new Promise((resolve) => setTimeout(resolve, 5000))

  // initially create offers for other players
  // but only for those who havent had send an offer to current player
  // already
  useEffect(() => {
    const otherOnlinePlayerIdsWithoutConnection = otherOnlinePlayers
      .map(({ id }) => id)
      .filter((id) => !rtcConnector.hasConnection(id))

    console.log('--- create offer --- user media stream?', userMediaStream)
    console.log('--- create offer --- otherOnlinePlayers', otherOnlinePlayers)

    if (
      player &&
      otherOnlinePlayerIdsWithoutConnection.length &&
      userMediaStream
    ) {
      ;(async function () {
        Promise.all(
          otherOnlinePlayerIdsWithoutConnection.map(async (otherPlayerId) => {
            const offer = await rtcConnector.createOffer(
              player?.id,
              otherPlayerId,
              userMediaStream
            )
            console.log('emitting offer to player', otherPlayerId)
            socket.emit(WebrtcSignalEvents.offer, offer)
          })
        )
      })()
    }
  }, [otherOnlinePlayers, player, userMediaStream])

  // receive the answers
  useEffect(() => {
    socket.removeAllListeners(WebrtcSignalEvents.newAnswer)
    socket.on(WebrtcSignalEvents.newAnswer, onNewAnswer)
  }, [onNewAnswer])

  // receive offers by new players
  useEffect(() => {
    socket.removeAllListeners(WebrtcSignalEvents.newOffer)
    socket.on(WebrtcSignalEvents.newOffer, onNewOffer)
  }, [onNewOffer])

  useEffect(() => {
    if (player?.is_audio_video_enabled === true && !userMediaStream && !!game) {
      ;(async function () {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia(
            getUserMediaConstraints()
          )
          setUserMediaStream(mediaStream)
          setIsVideoStreamingReady(true)
          game?.registry.set(REGISTRY_PLAYER_MEDIA_STREAM, mediaStream)
        } catch (e) {
          console.error('cannot request user media', e)
        }
      })()
    }
  }, [player?.is_audio_video_enabled, userMediaStream, game])

  return <Hidden></Hidden>
})
