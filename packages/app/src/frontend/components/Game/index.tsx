import React, {
  FunctionComponent,
  useContext,
  useEffect,
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
import { Canvas, EditMode, FullPageLoader, Webrtc } from '..'
import { StoreContextProvider } from '../../../state'

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

export const Game: FunctionComponent<GameProps> = () => {
  const [game, setGame] = useState<Phaser.Game | undefined>(undefined)
  const [client, setClient] = useState<Client | undefined>()
  const [isGameInitiated, setIsGameInitiated] = useState<boolean>(false)
  const [isCanvasReady, setIsCanvasReady] = useState(false)
  const [gameObjectTypes, setGameObjectTypes] = useState<
    GameObjectType[] | undefined
  >()
  const [gameObjectModel, setGameObjectModel] = useState<GameObject<Settings>>()
  const [isMediaStreamPopulated, setIsMediaStreamPopulated] = useState(false)
  const apolloClient = useApolloClient()
  const { api } = useContext(ApiContext)

  let player: Player | undefined
  if (client?.rooms[0]?.players) {
    player = client.rooms[0].players.find(
      (player) => player.id === localStorage.getItem('userId')
    )
  }
  let room: Room | undefined
  if (client?.rooms[0]) {
    room = client.rooms[0]
  }

  // const { data: playerByPk } = useSubscription<{ player_by_pk: Player }>(
  //   subscribeToPlayerUpdates,
  //   {
  //     client: apolloClient,
  //     variables: { id: localStorage.getItem('userId') },
  //   }
  // )
  // const player = playerByPk?.player_by_pk
  // console.log('player player_by_pk', player)

  useEffect(() => {
    if (client && !isGameInitiated && isCanvasReady) {
      setGame(initiateGame(apolloClient))
      setIsGameInitiated(true)
    }
  }, [apolloClient, setGame, client, isGameInitiated, isCanvasReady])

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
    <StoreContextProvider
      graphQl={apolloClient}
      roomId={room!.id}
      userId={localStorage.getItem('userId')!}
      client={client!}
      gameObjectTypes={gameObjectTypes!}
      game={game}
    >
      <EditMode />
      {!!game && <MenuControls />}
      {!!game && renderSettingsModal()}
      <Canvas onReady={() => setIsCanvasReady(true)} />
      {isDataLoaded && !!game && <Webrtc />}
    </StoreContextProvider>
  )
}
