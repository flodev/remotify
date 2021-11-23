import { RtcConnectionPool } from './RtcConnectionPool'

describe('rtcConnector', () => {
  //   const rtcPeerConnectionMock = {} as RTCPeerConnection
  //   const rtcFactory = {
  //     createPeerConnection: () => {
  //       return rtcPeerConnectionMock
  //     },
  //   }
  //   test('connection test', () => {
  //     const connector = new RtcConnector()
  //     const offers = connector.createOffers(otherPlayers)
  //     // send offers
  //     connector.receiveAnswers(webrtcAnswers)
  //   })
  //   test('creates rtc peer connection', () => {
  //     const spy = jest.spyOn(rtcFactory, 'createPeerConnection')
  //     const config = {
  //       currentPlayerId: '1',
  //       playerIds: ['2'],
  //       rtcFactory,
  //       sendOffer: () => Promise.resolve(),
  //     }
  //     const connector = new RtcConnector()
  //     connector.initConnections(config)
  //     expect(spy).toHaveBeenCalled()
  //     spy.mockRestore()
  //   })
  //   test('creates rtc peer connection and creates offer for current user', (done) => {
  //     // @ts-ignore
  //     rtcPeerConnectionMock.createOffer = (options?: RTCOfferOptions) =>
  //       Promise.resolve({ sdp: 'sdfsdf', type: 'offer' as const })
  //     const spy = jest.spyOn(rtcPeerConnectionMock, 'createOffer')
  //     const sendOffer = jest.fn()
  //     const config = {
  //       currentPlayerId: '1',
  //       playerIds: ['1', '2'],
  //       rtcFactory,
  //       sendOffer,
  //     }
  //     const connector = new RtcConnector()
  //     connector.initConnections(config)
  //     expect(spy).toHaveBeenCalled()
  //     setTimeout(() => {
  //       expect(sendOffer).toHaveBeenCalled()
  //       done()
  //     })
  //     spy.mockRestore()
  //   })
})
