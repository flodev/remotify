export class RtcFactory {
  createPeerConnection(config: RTCConfiguration) {
    return new RTCPeerConnection(config)
  }
}
