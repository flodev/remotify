import React, {
  useState,
  useEffect,
  useContext,
  ElementRef,
  useRef,
} from 'react'
import { useApolloClient } from '@apollo/client'
import { ClientContext, GameStateContext } from '../../context'
import { Video } from '../Video'
import { Col, Divider, Dropdown, Row, Spin, Switch, Menu, Button } from 'antd'
import { VideoCameraAddOutlined } from '@ant-design/icons'
import { getUserMediaConstraints } from '../../utils'

interface VideoFormProps {}

export const VideoForm = ({}: VideoFormProps) => {
  const { player } = useContext(ClientContext)
  const {
    userMediaStream,
    setUserMediaStream,
    setIsVideoStreamingReady,
  } = useContext(GameStateContext)

  const { api } = useContext(GameStateContext)

  const apolloClient = useApolloClient()
  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([])
  const [selectedVideoInput, selectVideoInput] = useState<
    MediaDeviceInfo | undefined
  >(undefined)
  const videoRef = useRef<ElementRef<typeof Video> | null>()

  const fetchVideoInputs = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    console.log('devices', devices)
    setVideoInputs(devices.filter((input) => input.kind === 'videoinput'))
    selectVideoInput(videoInputs[0])
  }

  useEffect(() => {
    if (videoInputs.length && !selectedVideoInput) {
      selectVideoInput(videoInputs[0])
    }
  }, [videoInputs])

  useEffect(() => {
    setIsEnablingAudioVideoInProcess(false)
  }, [player?.is_audio_video_enabled])

  useEffect(() => {
    if (player?.is_audio_video_enabled === true) {
      ;(async function () {
        if (!userMediaStream) {
          await enableAudioVideo()
        }
        await fetchVideoInputs()
      })()
    } else {
      if (userMediaStream) {
        disableUserMedia()
        console.log('set user media stream undefined')
        setUserMediaStream(undefined)
      }
    }
  }, [player?.is_audio_video_enabled])
  const [
    isEnablingAudioVideoInProcess,
    setIsEnablingAudioVideoInProcess,
  ] = useState(false)

  const switchAudioVideo = async (checked: boolean) => {
    // await enableAudioVideo()
    setIsEnablingAudioVideoInProcess(true)
    try {
      if (checked === true) {
        await enableAudioVideo()
      }
      console.log('audio video enabled')
      await api.changeAudioVideoEnabled({
        id: localStorage.getItem('userId')!,
        is_enabled: checked,
      })
      console.log('change request done')
    } catch (e) {
      console.error('cannot update is audio video', e)
      setIsEnablingAudioVideoInProcess(false)
    }
  }

  const disableUserMedia = () => {
    if (!userMediaStream) {
      console.error('trying to disable not existing user media stream')
      return
    }
    userMediaStream.getVideoTracks().forEach((track) => track.stop())
    userMediaStream.getAudioTracks().forEach((track) => track.stop())
  }

  // useRtcPeerConnection(userMediaStream)

  const enableAudioVideo = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia(
      getUserMediaConstraints()
    )
    console.log('set user media mediaStream', mediaStream)
    setUserMediaStream(mediaStream)
    // console.log("videoRef", videoRef)
    // if (videoRef && videoRef.current) {
    //   videoRef.current.srcObject = mediaStream
    //   videoRef.current.play()
    // }
  }

  if (isEnablingAudioVideoInProcess) {
    return <Spin />
  }
  return (
    <>
      <Switch
        onChange={switchAudioVideo}
        checked={player?.is_audio_video_enabled}
      />{' '}
      enable Audio/Video
      {!!player?.is_audio_video_enabled && (
        <>
          <Divider>Video</Divider>
          <Video
            // @ts-ignore
            ref={videoRef}
            mediaStream={userMediaStream}
            readyToPlay={async () => {
              try {
                console.log('video play start')
                console.log('method', videoRef.current?.playVideo)
                await videoRef.current?.playVideo()
                console.log('video play done')
                setIsVideoStreamingReady(true)
                console.log('set video streaming ready', videoRef.current)
              } catch (e) {
                console.error('cannot play the video', e)
              }
            }}
          />
          <Row>
            <Col>
              <Dropdown
                overlay={
                  <Menu onClick={() => {}}>
                    {videoInputs.map((input) => (
                      <Menu.Item
                        key={input.deviceId}
                        icon={<VideoCameraAddOutlined />}
                      >
                        {input.label}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <Button
                  style={{
                    width: '100%',
                  }}
                >
                  <span
                    style={{
                      width: '100%',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {selectedVideoInput?.label}
                  </span>
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}