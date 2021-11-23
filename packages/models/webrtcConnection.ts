export enum WebrtcMessageTypes {
  offer = 'offer',
  answer = 'answer',
  candidate = 'candidate',
}

type WebrtcMessageType =
  | WebrtcMessageTypes.offer
  | WebrtcMessageTypes.answer
  | WebrtcMessageTypes.candidate
export interface WebrtcConnection<T extends WebrtcMessageType> {
  id?: string
  senderId: string
  receiverId: string
  type: T
  message: T extends WebrtcMessageTypes.offer | WebrtcMessageTypes.answer
    ? RTCSessionDescriptionInit
    : RTCIceCandidate
}
