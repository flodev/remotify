import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { initiateGame } from '../../../game/phaser'
import { MenuControls } from '../MenuControls'
import { useApolloClient } from '@remotify/graphql'
import { ApiContext } from '../../context'
import { EVENT_OPEN_GAME_OBJECT_SETTINGS } from '../../app/GameEvents'
import { PlaceObjectsTypes } from '../../../game/gameobjects'
import {
  Client,
  GameObject,
  GameObjectType,
  Player,
  Room,
  Settings,
  ToiletSettings,
} from '@remotify/models'
import { EditGameObjectDesk, EditGameObjectToilet } from '../EditGameObject'
import { REGISTRY_IS_SETTINGS_MODAL_OPEN } from '../../../constants'
import { Canvas, Controls, EditMode, FullPageLoader, Webrtc } from '..'
import { StoreContextProvider } from '../../../state'
import { message } from 'antd'

// Set the name of the hidden property and the change event for visibility
let visibilityChange:
  | 'visibilitychange'
  | 'msvisibilitychange'
  | 'webkitvisibilitychange'
let hidden: 'hidden' | 'msHidden' | 'webkitHidden'
if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden'
  visibilityChange = 'visibilitychange'
  // @ts-ignore
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden'
  visibilityChange = 'msvisibilitychange'
  // @ts-ignore
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden'
  visibilityChange = 'webkitvisibilitychange'
}

interface GameProps {}

export const GameLoader: FunctionComponent<GameProps> = () => {
  const [isCanvasReady, setIsCanvasReady] = useState(false)
  const apolloClient = useApolloClient()
  const { api } = useContext(ApiContext)

  // useEffect(() => {
  // document.addEventListener(visibilityChange, () => {
  //   // @ts-ignore
  //   if (document[hidden]) {
  //   } else {
  //   }
  // })
  // }, [player])

  useEffect(() => {
    if (!localStorage.getItem('roomId')) {
      message.error('invalid local data. clear cache and reload.')
    }
  }, [])

  if (!localStorage.getItem('roomId')) {
    return <FullPageLoader />
  }

  return (
    <StoreContextProvider
      graphQl={apolloClient}
      roomId={localStorage.getItem('roomId')!}
      userId={localStorage.getItem('userId')!}
      api={api}
    >
      {isCanvasReady && <Controls />}
      <Canvas onReady={() => setIsCanvasReady(true)} />
    </StoreContextProvider>
  )
}
