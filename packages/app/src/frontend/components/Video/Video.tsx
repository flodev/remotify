import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import styled from 'styled-components'
import { getMobileOperatingSystem, MobileOs } from './getMobileOperatingSystem'

const VideoStyled = styled.video`
  width: 100%;
`

const getResolutionByOs = (os: MobileOs) => {
  console.log('os', os)
  if (os === 'iOS') {
    return {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    }
  }
  return { width: { ideal: 1080 }, height: { ideal: 1920 } }
}

export interface VideoProps {
  onPlaying?(): void
  readyToPlay?(): void
  mediaStream?: MediaStream
}

type VideoHandle = {
  // requestVideo(): Promise<void>
  playVideo(): Promise<void>
  getVideoElement(): HTMLVideoElement | null
}

const VideoComponent: ForwardRefRenderFunction<VideoHandle, VideoProps> = (
  { onPlaying, mediaStream, readyToPlay },
  ref
) => {
  const system = getMobileOperatingSystem()

  const constraints = {
    audio: false,
    video: {
      ...getResolutionByOs(system),
      facingMode: 'environment',
    },
  }

  const videoRef = useRef<HTMLVideoElement | null>(null)

  useImperativeHandle(ref, () => ({
    // requestVideo: async () => {
    //   try {
    //     const supported = navigator.mediaDevices.getSupportedConstraints()
    //     // let devices = await navigator.mediaDevices.enumerateDevices()
    //     // const firstDevice = devices.find(
    //     //   (device) => device.kind === 'videoinput'
    //     // )
    //     const stream = await navigator.mediaDevices.getUserMedia(constraints)
    //     if (supported.aspectRatio) {
    //       stream.getVideoTracks().forEach((track) => {
    //         track.applyConstraints({
    //           aspectRatio: window.innerHeight / window.innerWidth,
    //         })
    //       })
    //     }
    //     requestVideoSuccess(stream)
    //   } catch (e) {
    //     console.error("get user media error", e)
    //     throw new Error("get user media error")
    //   }
    // },
    playVideo: async () => {
      if (videoRef && videoRef.current) {
        console.log('start playing video')
        return videoRef.current.play()
      } else {
        console.log('cannot play, video ref not there')
      }
    },
    getVideoElement: () => videoRef.current,
  }))

  const requestVideoSuccess = (stream: MediaStream) => {
    if (videoRef && videoRef.current) {
      videoRef.current.srcObject = stream
      console.log('setting media stream to video')
      readyToPlay && readyToPlay()
    }
  }

  useEffect(() => {
    if (mediaStream) {
      requestVideoSuccess(mediaStream)
    }
  }, [mediaStream])

  return (
    <VideoStyled
      ref={videoRef}
      playsInline
      onPlay={() => console.log('onPlay')}
      onPlayCapture={() => console.log('onPlayCapture')}
      onPlaying={onPlaying}
      muted
    ></VideoStyled>
  )
}

export const Video = forwardRef(VideoComponent)
