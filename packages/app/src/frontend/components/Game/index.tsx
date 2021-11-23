import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { initiateGame } from '../../../game/phaser'
import { MenuControls } from '../MenuControls'
import { useQuery, gql, useApolloClient, useSubscription } from '@apollo/client'
import { ClientContext, SocketContext } from '../../context'
import { GameStateContext } from '../../context'
import styled from 'styled-components'
import {
  EVENT_OPEN_GAME_OBJECT_SETTINGS,
  EVENT_RECEIVED_USER_MEDIA_STREAM,
} from '../../app/GameEvents'
import { PhaserGameObject, PlaceObjectsTypes } from '../../../game/gameobjects'
import {
  Client,
  GameObject,
  GameObjectType,
  Player,
  Settings,
  ToiletSettings,
} from '@remotify/models'
import { EditGameObjectDesk, EditGameObjectToilet } from '../EditGameObject'
import {
  REGISTRY_IS_SETTINGS_MODAL_OPEN,
  REGISTRY_PLAYER_MEDIA_STREAM,
} from '../../../constants'
import { Canvas, FullPageLoader, Webrtc } from '..'
import { subscribeToPlayerUpdates } from '@remotify/graphql'

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

const EditMode = styled.div<{ isEditMode: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: all;
  border: ${(props) => (props.isEditMode ? '2px solid palevioletred' : '0')};
`

export const Game: FunctionComponent<GameProps> = () => {
  const [client, setClient] = useState<Client | undefined>()
  const [isGameInitiated, setIsGameInitiated] = useState<boolean>(false)
  const [gameObjectTypes, setGameObjectTypes] = useState<
    GameObjectType[] | undefined
  >()
  const [gameObjectModel, setGameObjectModel] = useState<GameObject<Settings>>()
  const [isMediaStreamPopulated, setIsMediaStreamPopulated] = useState(false)
  const {
    setGame,
    userMediaStream,
    game,
    isVideoStreamingReady,
    api,
  } = useContext(GameStateContext)
  const apolloClient = useApolloClient()
  const { isEditMode } = useContext(GameStateContext)

  const { data: playerByPk } = useSubscription<{ player_by_pk: Player }>(
    subscribeToPlayerUpdates,
    {
      client: apolloClient,
      variables: { id: localStorage.getItem('userId') },
    }
  )
  const player = playerByPk?.player_by_pk
  console.log('player player_by_pk', player)

  useEffect(() => {
    if (client && !isGameInitiated) {
      setGame(initiateGame(apolloClient))
      setIsGameInitiated(true)
    }
  }, [client, isGameInitiated])

  useEffect(() => {
    if (!gameObjectTypes) {
      ;(async function () {
        try {
          const response = await api.getGameObjectTypes()
          if (response) {
            setGameObjectTypes(response)
          }
        } catch (e) {
          console.error('cannot get game object types')
        }
      })()
    }
  }, [gameObjectTypes])

  useEffect(() => {
    if (
      game &&
      player &&
      userMediaStream &&
      isVideoStreamingReady &&
      !isMediaStreamPopulated
    ) {
      console.log('emit media stream')
      game.registry.set(REGISTRY_PLAYER_MEDIA_STREAM, userMediaStream)
      setIsMediaStreamPopulated(true)
    }
  }, [game, player, userMediaStream, isVideoStreamingReady])

  useEffect(() => {
    if (game) {
      game.events.on(
        EVENT_OPEN_GAME_OBJECT_SETTINGS,
        (gameObject: GameObject<Settings>) => {
          setGameObjectModel({ ...gameObject })
          console.log('gameObject', gameObject)
          game.registry.set(REGISTRY_IS_SETTINGS_MODAL_OPEN, true)
        }
      )
    }
  }, [game])

  useEffect(() => {
    // document.addEventListener(visibilityChange, () => {
    //   // @ts-ignore
    //   if (document[hidden]) {
    //   } else {
    //   }
    // })
    if (player && player.is_online === false) {
      api.updatePlayer({
        object: {
          is_online: true,
        },
        id: localStorage.getItem('userId')!,
      })
    }
  }, [player])

  useEffect(() => {
    if (!client) {
      ;(async function () {
        try {
          const response = await api.getClientWithRoomsAndPlayers()
          if (response.length > 0) {
            setClient(response[0])
          } else {
            throw new Error('client data malformed')
          }
        } catch (e) {
          console.error('cannot fetch client data', e)
        }
      })()
    }
  }, [client])

  const onClose = () => {
    setGameObjectModel(undefined)
    game?.registry.set(REGISTRY_IS_SETTINGS_MODAL_OPEN, false)
  }

  const renderSettingsModal = () => {
    if (
      !!gameObjectModel &&
      gameObjectModel.gameobjectype.name === PlaceObjectsTypes.Desk
    ) {
      return <EditGameObjectDesk desk={gameObjectModel} onClose={onClose} />
    }
    if (
      !!gameObjectModel &&
      gameObjectModel.gameobjectype.name === PlaceObjectsTypes.Toilet
    ) {
      return (
        <EditGameObjectToilet
          toilet={gameObjectModel as GameObject<ToiletSettings>}
          onClose={onClose}
        />
      )
    }
    return <></>
  }

  const isDataLoaded: boolean = !!(client && gameObjectTypes)

  if (!isDataLoaded || !player) {
    return <FullPageLoader />
  }

  return (
    <ClientContext.Provider
      value={{
        client,
        gameObjectTypes: gameObjectTypes || [],
        player,
      }}
    >
      <EditMode isEditMode={isEditMode}>
        <MenuControls />
        {renderSettingsModal()}
        <Canvas />
        {isDataLoaded && <Webrtc />}
      </EditMode>
    </ClientContext.Provider>
  )
}
