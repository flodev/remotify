import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import React, { useContext, useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { subscribeToOtherOnlinePlayers } from '@remotify/graphql'
import {
  Player,
  WebrtcConnection,
  WebrtcMessageTypes,
  WebrtcSignalEvents,
  RegisterSignal,
} from '@remotify/models'
import { EVENT_RECEIVED_USER_MEDIA_STREAM } from '../../app/GameEvents'
import { ClientContext, GameStateContext, SocketContext } from '../../context'
import {
  getUserMediaConstraints,
  RtcConnectionPool,
  RtcFactory,
} from '../../utils'

interface WebrtcProps {}
const rtcConnector = new RtcConnectionPool({ rtcFactory: new RtcFactory() })

const Hidden = styled.div`
  display: none;
`

export const Webrtc = ({}: WebrtcProps) => {
  const { client, player } = useContext(ClientContext)
  const socket = useContext(SocketContext)
  const {
    userMediaStream,
    game,
    setUserMediaStream,
    isVideoStreamingReady,
    setIsVideoStreamingReady,
  } = useContext(GameStateContext)
  const roomId = client?.rooms[0].id!

  const onNewCandidate = useCallback(
    async ({
      message,
      senderId,
    }: WebrtcConnection<WebrtcMessageTypes.candidate>) => {
      try {
        await rtcConnector.addCandidate(message, senderId)
      } catch (e) {
        console.error('cannot add ice candidate for player', senderId)
        console.error(e)
      }
    },
    []
  )

  const onNewOffer = useCallback(
    (offer: WebrtcConnection<WebrtcMessageTypes.offer>) => {
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
        console.log('newAnswer userMediaStream', userMediaStream)
        await rtcConnector.receiveAnswer(message, senderId, userMediaStream)
      } catch (e) {
        console.error('cannot receive answer', { message, senderId, ...rest })
      }
    },
    [userMediaStream]
  )

  const { data: otherOnlinePlayers } = useSubscription<{ player: Player[] }>(
    subscribeToOtherOnlinePlayers,
    {
      variables: { roomId, playerId: player!.id },
    }
  )

  console.log('otherOnlinePlayers', otherOnlinePlayers)

  useEffect(() => {
    const register: RegisterSignal = {
      id: player!.id,
    }
    socket.emit(WebrtcSignalEvents.register, register)
  }, [])

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
    rtcConnector.onIceCandidate((event, playerId) => {
      if (event.candidate) {
        const rtcConnectionMessage: WebrtcConnection<WebrtcMessageTypes.candidate> = {
          message: event.candidate,
          receiverId: playerId,
          senderId: player!.id,
          type: WebrtcMessageTypes.candidate,
        }
        socket.emit(WebrtcSignalEvents.candidate, rtcConnectionMessage)
      }
    })
  }, [])

  const delay = () => new Promise((resolve) => setTimeout(resolve, 5000))

  // initially create offers for other players
  // but only for those who havent had send an offer to current player
  // already
  useEffect(() => {
    const otherOnlinePlayerIdsWithoutConnection = (
      otherOnlinePlayers?.player || []
    )
      .map(({ id }) => id)
      .filter((id) => !rtcConnector.hasConnection(id))

    if (
      player &&
      otherOnlinePlayerIdsWithoutConnection.length &&
      userMediaStream &&
      isVideoStreamingReady
    ) {
      ;(async function () {
        Promise.all(
          otherOnlinePlayerIdsWithoutConnection.map(async (otherPlayerId) => {
            const offer = await rtcConnector.createOffer(
              player?.id,
              otherPlayerId,
              userMediaStream
            )
            socket.emit(WebrtcSignalEvents.offer, offer)
          })
        )
      })()
    }
  }, [otherOnlinePlayers, player, userMediaStream, isVideoStreamingReady])

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
    if (player?.is_audio_video_enabled === true && !userMediaStream) {
      ;(async function () {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia(
            getUserMediaConstraints()
          )
          console.log('set user media stream', mediaStream)
          setUserMediaStream(mediaStream)
          setIsVideoStreamingReady(true)
        } catch (e) {
          console.error('cannot request user media', e)
        }
      })()
    }
  }, [player?.is_audio_video_enabled, userMediaStream])

  return <Hidden></Hidden>
}