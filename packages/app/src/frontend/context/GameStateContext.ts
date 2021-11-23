import React from 'react'
import { Api } from '../../../../open-api'
import { EditToolType } from '../../game/editTools'

interface GameStateContextType {
  game?: Phaser.Game
  isEditMode: boolean
  setGame(game: Phaser.Game): void
  setIsEditMode(isEditMode: boolean): void
  userMediaStream?: MediaStream
  setUserMediaStream(stream: MediaStream | undefined): void
  isVideoStreamingReady: boolean
  setIsVideoStreamingReady: (isVideoStreamingReady: boolean) => void
  api: Api
}

export const GameStateContext = React.createContext<GameStateContextType>({
  game: undefined,
  isEditMode: false,
  setGame: () => {},
  setIsEditMode: () => {},
  userMediaStream: undefined,
  setUserMediaStream: () => {},
  isVideoStreamingReady: false,
  setIsVideoStreamingReady: (isVideoStreamingReady: boolean) => {},
  api: {} as Api,
})
