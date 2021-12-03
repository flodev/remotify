import { makeObservable, observable, action } from 'mobx'

export class UserMediaStore {
  public userMediaStream?: MediaStream
  public isVideoStreamingReady = false

  constructor() {
    makeObservable(this, {
      userMediaStream: observable,
      isVideoStreamingReady: observable,
      setUserMediaStream: action,
      setIsVideoStreamingReady: action,
    })
  }

  setUserMediaStream = (userMediaStream?: MediaStream) => {
    this.userMediaStream = userMediaStream
  }

  setIsVideoStreamingReady = (isVideoStreamingReady: boolean) => {
    this.isVideoStreamingReady = isVideoStreamingReady
  }
}
