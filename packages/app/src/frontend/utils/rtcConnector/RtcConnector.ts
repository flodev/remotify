// import { RtcFactory } from './RtcFactory'
// import { Player, WebrtcConnection } from '../../../models'

// type Config = {
//   rtcFactory: RtcFactory
//   currentPlayerId: string
//   playerIds: string[]
//   userMediaStream?: MediaStream
//   sendOffer(
//     currentPlayerId: string,
//     otherPlayers: string[],
//     offer: RTCSessionDescriptionInit
//   ): Promise<void>
//   sendAnswer(
//     currentPlayerId: string,
//     playerId: string,
//     answer: RTCSessionDescriptionInit
//   ): Promise<void>
// }

// const rtcConfig = {
//   iceServers: [
//     {
//       urls: ['stun:stun.l.google.com:19302'],
//     },
//   ],
//   iceTransportPolicy: 'all' as const,
//   iceCandidatePoolSize: 2,
// }

// export class RtcConnector {
//   private config?: Config
//   private offer?: RTCSessionDescriptionInit
//   private currentPlayerConnection?: RTCPeerConnection
//   private connectionPool: {
//     peerConnection: RTCPeerConnection
//     playerId: string
//   }[] = []
//   constructor() {}

//   public addUserMediaTacks(userMedia: MediaStream) {
//     this.connectionPool.forEach(({ peerConnection }) => {
//       userMedia.getTracks().forEach((track) => peerConnection.addTrack(track))
//     })
//   }

//   public async init(config: Config) {
//     this.config = config
//     const { playerIds, currentPlayerId } = this.config
//     this.initConnection()
//     const offer = await this.createOffer(currentPlayerId)
//     playerIds.forEach(this.initConnection)
//   }

//   public hasConnections = () => {
//     return this.connectionPool.length > 0
//   }

//   public updatePlayerIds(playerIds: string[]) {
//     const existingIds = this.connectionPool.map(({ playerId }) => playerId)
//     const idsToDelete = existingIds.filter(
//       (id1) => !playerIds.map((id2) => id2).includes(id1)
//     )
//     idsToDelete.forEach((id) => {
//       const index = this.connectionPool.findIndex(
//         ({ playerId }) => playerId === id
//       )
//       // @todo: do something with the connection, destory or something
//       this.connectionPool.splice(index, 1)
//     })
//     playerIds.forEach((playerId) => {
//       if (!existingIds.includes(playerId)) {
//         this.initConnection(playerId)
//       }
//     })
//   }

//   public onWebrtcConnections(webrtcConnections: WebrtcConnection[]) {
//     this.escalateMissingConfig()
//     const { currentPlayerId } = this.config!
//     // const currentPlayerConnection = this.connectionPool.find(
//     //   ({ playerId }) => currentPlayerId === playerId
//     // )

//     const isOfferFromOtherPlayer = ({
//       answer,
//       player_id_sender,
//     }: WebrtcConnection) => {
//       return !answer && player_id_sender !== currentPlayerId
//     }
//     webrtcConnections.forEach(async (webRtcConnection) => {
//       const { player_id_sender, offer } = webRtcConnection
//       if (isOfferFromOtherPlayer(webRtcConnection)) {
//         const connection = this.connectionPool.find(
//           ({ playerId }) => playerId === player_id_sender
//         )
//         if (!connection) {
//           throw new Error('connection not found for player ' + player_id_sender)
//         }
//         this.createRemoteDescription(connection.peerConnection, offer)
//       }
//     })
//   }

//   private async createRemoteDescription(
//     connection: RTCPeerConnection,
//     offer: RTCSessionDescriptionInit
//   ) {
//     try {
//       await connection.setRemoteDescription(new RTCSessionDescription(offer))
//     } catch (e) {
//       console.error('cannot set remote description', e)
//     }
//   }

//   private createOffer = async (
//     peerConnection: RTCPeerConnection
//   ): Promise<RTCSessionDescriptionInit> => {
//     const offer = await peerConnection.createOffer({
//       offerToReceiveAudio: true,
//       offerToReceiveVideo: true,
//     })

//     console.log('create offer because its me', offer)
//     await peerConnection.setLocalDescription(offer)
//     return offer
//   }

//   private initConnection = async (playerId: string) => {
//     this.escalateMissingConfig()
//     const { rtcFactory, currentPlayerId, sendOffer, playerIds } = this.config!

//     console.log('init connection for player', playerId)
//     const peerConnection = rtcFactory.createPeerConnection(rtcConfig)
//     peerConnection.onicecandidate = (event) =>
//       this.onIceCandidate(event, peerConnection)

//     this.connectionPool.push({
//       peerConnection,
//       playerId,
//     })

//     // if (!this.offer) {
//     //   try {
//     //     this.offer = await this.createOffer(peerConnection)
//     //     const otherPlayers = playerIds.filter((id) => id !== currentPlayerId)
//     //     if (otherPlayers.length) {
//     //       await this.sendOfferToOtherPlayers(otherPlayers)
//     //     }
//     //   } catch (e) {
//     //     throw new Error('error dispatching offer' + e)
//     //   }
//     // }
//   }

//   private async sendOfferToOtherPlayers(otherPlayers: string[]) {
//     const { currentPlayerId, sendOffer } = this.config!
//     console.log('sendOfferToOtherPlayers')
//     try {
//       await sendOffer(currentPlayerId, otherPlayers, this.offer!)
//     } catch (e) {
//       throw new Error('cannot send offer' + e)
//     }
//   }

//   private onIceCandidate = async (
//     event: RTCPeerConnectionIceEvent,
//     peerConnection: RTCPeerConnection
//   ) => {
//     console.log('ice candidate?', event)
//     if (event.candidate) {
//       console.log('adding ice candidate', event)
//       try {
//         await peerConnection.addIceCandidate(event.candidate)
//       } catch (e) {
//         console.error('addIceCandidate error', e)
//       }
//     }
//   }

//   private escalateMissingConfig() {
//     if (!this.config) {
//       throw new Error('config is missing')
//     }
//   }
// }
export {}
