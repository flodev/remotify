import { RtcFactory } from './RtcFactory'
import { WebrtcConnection, WebrtcMessageTypes } from '@remotify/models'

type Config = {
  rtcFactory: RtcFactory
}

const rtcConfig = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302'],
    },
  ],
  iceTransportPolicy: 'all' as const,
  iceCandidatePoolSize: 2,
}

type RemoteStreamListener = (ev: RTCTrackEvent, playerId: string) => any
type OnConnectionRemoveListener = (playerId: string) => any
type IceCandidateListener = (
  ev: RTCPeerConnectionIceEvent,
  playerId: string
) => any

type Connection = {
  peerConnection: RTCPeerConnection
  playerId: string
}

export class RtcConnectionPool {
  private remoteStreamListener?: RemoteStreamListener
  private iceCandidateListener?: IceCandidateListener
  private onConnectionRemoveListener?: OnConnectionRemoveListener
  private connectionPool: Connection[] = []

  constructor(private config: Config) {}

  /**
   * - initially executed after the player joined
   * - playerIds should contain all ids from other players
   * - a connection will be initiated for each id and the offers are returned
   * - the offers the should be send to webrtc_connection table so that other players
   * will receive the offer
   */
  public async createOffer(
    currentPlayerId: string,
    playerId: string,
    userMediaStream?: MediaStream
  ): Promise<WebrtcConnection<WebrtcMessageTypes.offer>> {
    if (this.hasConnection(playerId)) {
      this.removeConnection(playerId)
    }
    const { peerConnection } = await this.initConnection(
      playerId,
      userMediaStream
    )
    try {
      const offer = await this.createPeerOffer(peerConnection)
      console.log('setting offer as local description', offer)
      await peerConnection.setLocalDescription(offer)
      const webRtcConnection: WebrtcConnection<WebrtcMessageTypes.offer> = {
        type: WebrtcMessageTypes.offer,
        message: offer,
        senderId: currentPlayerId,
        receiverId: playerId,
      }
      return webRtcConnection
    } catch (e) {
      throw new Error('error creating offer ' + e)
    }
  }

  /**
   * the answer from send offer will be received
   */
  public async receiveAnswer(
    message: RTCSessionDescriptionInit,
    senderId: string,
    userMediaStream?: MediaStream
  ): Promise<void> {
    if (!message) {
      throw new Error('message is not defined')
    }
    const connection = await this.getOrCreateConnection(
      senderId,
      userMediaStream
    )
    console.log('setting answer as remote description', message)
    await this.createRemoteDescription(connection.peerConnection, message)
  }

  /**
   * new players send new offers
   */
  public async receiveOffer(
    rtcConnection: WebrtcConnection<WebrtcMessageTypes.offer>,
    userMediaStream?: MediaStream
  ): Promise<WebrtcConnection<WebrtcMessageTypes.answer>> {
    const { message, senderId, receiverId } = rtcConnection
    if (this.hasConnection(senderId)) {
      this.removeConnection(senderId)
    }
    const { peerConnection } = await this.initConnection(
      senderId,
      userMediaStream
    )
    console.log('setting offer as remote description', message)
    peerConnection.setRemoteDescription(message)
    const answer = await peerConnection.createAnswer()
    console.log('setting answer as local description', answer)
    peerConnection.setLocalDescription(answer)
    return {
      senderId: receiverId,
      receiverId: senderId,
      message: answer,
      type: WebrtcMessageTypes.answer as const,
    }
  }

  public onRemoteStream(remoteStreamListener: RemoteStreamListener) {
    this.remoteStreamListener = remoteStreamListener
  }

  public onIceCandidate(iceCandidateListener: IceCandidateListener) {
    this.iceCandidateListener = iceCandidateListener
  }

  public async addCandidate(candidate: RTCIceCandidate, playerId: string) {
    const connection = this.connectionPool.find(
      ({ playerId: searchId }) => searchId === playerId
    )
    if (!candidate) {
      console.warn('insufficient ice candidate')
      return
    }
    if (!connection) {
      throw new Error(
        `trying to add ice candidate but connection not found for player ${playerId}`
      )
    }
    if (candidate && connection) {
      await this.addIceCandidateToPeerConnection(
        candidate,
        connection.peerConnection
      )
    }
  }

  private async getOrCreateConnection(
    senderId: string,
    userMediaStream?: MediaStream
  ) {
    let connection
    if (this.hasConnection(senderId)) {
      connection = this.getConnection(senderId)!
    } else {
      connection = await this.initConnection(senderId, userMediaStream)
    }
    return connection
  }

  private addUserMediaTracks(
    peerConnection: RTCPeerConnection,
    userMediaStream: MediaStream
  ) {
    console.log('add user media tracks to connection', userMediaStream)
    userMediaStream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, userMediaStream))
  }

  public hasConnection(playerIdToSearch: string) {
    return this.getConnection(playerIdToSearch) !== undefined
  }

  public getRedundantConnectionIds(playerIds: string[]) {
    const existingIds = this.connectionPool.map(({ playerId }) => playerId)
    return existingIds.filter((id) => !playerIds.includes(id))
  }

  public removeConnection(playerIdToRemove: string) {
    const index = this.connectionPool.findIndex(
      ({ playerId }) => playerId === playerIdToRemove
    )
    if (index === -1) {
      console.log('trying to remove not existent connection', playerIdToRemove)
      return
    }
    console.log('removing and closing connection')
    const { peerConnection } = this.connectionPool[index]
    peerConnection.close()
    this.connectionPool.splice(index, 1)
    this.onConnectionRemoveListener &&
      this.onConnectionRemoveListener(playerIdToRemove)
  }

  private getConnection(playerIdToSearch: string) {
    return this.connectionPool.find(
      ({ playerId }) => playerId === playerIdToSearch
    )
  }

  private async createRemoteDescription(
    connection: RTCPeerConnection,
    description: RTCSessionDescriptionInit
  ) {
    try {
      await connection.setRemoteDescription(
        new RTCSessionDescription(description)
      )
    } catch (e) {
      console.error('cannot set remote description', e)
    }
  }

  private createPeerOffer = async (
    peerConnection: RTCPeerConnection
  ): Promise<RTCSessionDescriptionInit> => {
    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    })

    console.log('created offer', offer)
    return offer
  }

  private initConnection = async (
    playerId: string,
    userMediaStream?: MediaStream
  ): Promise<Connection> => {
    this.escalateMissingConfig()
    const { rtcFactory } = this.config!

    console.log('init connection for player', playerId)
    const peerConnection = rtcFactory.createPeerConnection(rtcConfig)
    peerConnection.addEventListener('icecandidate', (event) => {
      if (this.iceCandidateListener) {
        this.iceCandidateListener(event, playerId)
      }
    })

    peerConnection.addEventListener('iceconnectionstatechange', () => {
      const connection = this.connectionPool.find(
        ({ playerId: existingId }) => playerId === existingId
      )

      if (connection) {
        const state = connection.peerConnection.iceConnectionState
        console.log(`iceConnectionState ${playerId}`, state)
        if (
          state === 'failed' ||
          state === 'closed' ||
          state === 'disconnected'
        ) {
          this.removeConnection(playerId)
        }
      }
    })

    const poolItem: Connection = {
      peerConnection,
      playerId,
    }

    this.addOnTrackEvent(poolItem, playerId)

    if (userMediaStream) {
      this.addUserMediaTracks(peerConnection, userMediaStream)
    }

    this.connectionPool.push(poolItem)
    return poolItem
  }

  private addOnTrackEvent = (poolItem: Connection, playerId: string) => {
    console.log('adding on track event for', playerId)
    poolItem.peerConnection.addEventListener(
      'track',
      (event: RTCTrackEvent) => {
        console.log('received track', playerId)
        if (this.remoteStreamListener) {
          this.remoteStreamListener(event, playerId)
        } else {
          console.error(
            'received ontrack event but remote stream listener is not there'
          )
        }
      }
    )
  }

  private addIceCandidateToPeerConnection = async (
    candidate: RTCIceCandidate,
    peerConnection: RTCPeerConnection
  ) => {
    console.log('adding ice candidate', candidate)
    try {
      await peerConnection.addIceCandidate(candidate)
    } catch (e) {
      console.error('addIceCandidate error', e)
    }
  }

  private escalateMissingConfig() {
    if (!this.config) {
      throw new Error('config is missing')
    }
  }
}
