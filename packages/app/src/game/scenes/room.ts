import Phaser, { Tilemaps, Input } from 'phaser'
import { Player, PlayerFactory } from '../player'
import { getGrid } from '../utils/getGrid'
import { ApolloClient, InMemoryCache } from '@remotify/graphql'
import pick from 'lodash.pick'
import { InteractionMenu, InteractionMenuEntry } from '../interactionMenu'
import {
  changePlayerPosition,
  changeRoomTile,
  upsertGameObject,
  activateInteraction,
} from '@remotify/graphql'

import { initCalculateWaypoints } from '../../graphql'
import {
  TILE_ID_FREE_PLACE,
  TILE_ID_OCCUPIED,
  TILE_ID_WALL,
} from '../utils/tileIds'
import {
  EVENT_CAMERA_START_FOLLOW_PLAYER,
  EVENT_OPEN_GAME_OBJECT_SETTINGS,
  EVENT_FREE_OCCUPIED_TILES,
  EVENT_OPEN_INTERACTION_MENU,
  EVENT_GAME_OBJECT_CLICK,
  EVENT_RECEIVED_USER_MEDIA_STREAM,
} from '../../frontend/app/GameEvents'
import { EditToolFactory, EditToolType, PlaceGameObject } from '../editTools'
import { ToolbarTool } from '../editTools'
import {
  GAME_TILE_HEIGHT,
  REGISTRY_CHANGE_EDIT_TOOL,
  REGISTRY_CHANGE_PLACE_OBJECTS,
  REGISTRY_GRAPHQL_CLIENT,
  REGISTRY_IS_EDIT_MODE,
  REGISTRY_IS_SETTINGS_MODAL_OPEN,
  REGISTRY_PLAYER_MEDIA_STREAM,
  REGISTRY_STORE_CONTEXT,
} from '../../constants'
import {
  Client,
  GameObject as GameObjectModel,
  Room,
  Player as PlayerModel,
  OccupiedTile,
  Settings,
  GameObjectType,
  GameObject,
} from '@remotify/models'
import {
  PlaceObject,
  ASSET_NAME_ROOM_TILE,
  GameObjectsUpdater,
  GameObjectFactory,
  PhaserGameObject,
} from '../gameobjects'
import {
  getAnimationInteractionType,
  getInteractionAnimations,
  getInteractionTile,
  UnsubscribeFunction,
  ZIndexer,
} from '../utils'
import { getInteractionForPlayer, InteractionReceiver } from '../interact'
import i18n from '../../i18n'
import { StoreContext } from '../../state'
import { autorun } from 'mobx'

var easystarjs = require('easystarjs')
let cursors: Phaser.Types.Input.Keyboard.CursorKeys
const PhaserEvents = Input.Events

export interface RoomConfig {
  clients: Client[]
  gameObjectTypes: GameObjectType[]
}

export class RoomScene extends Phaser.Scene {
  private player?: Player
  private players: PlayerModel[] = []
  private map?: Tilemaps.Tilemap
  private layer?: Tilemaps.TilemapLayer
  private unsubscribeClickDetected?: UnsubscribeFunction

  private graphQl?: ApolloClient<InMemoryCache>
  private editTool?: ToolbarTool
  private placeObject?: PlaceObject
  private easystar: any
  private room: Room
  private gameObjectUpdater: GameObjectsUpdater<GameObject<Settings>>
  private gameObjectFactory: GameObjectFactory
  private isInteractionMenuOpen: boolean = false
  private interactionMenu?: InteractionMenu
  private gameObjectTypes: GameObjectType[]
  private playerFactory?: PlayerFactory
  private playerUpdater?: GameObjectsUpdater<PlayerModel>
  private zIndexer: ZIndexer
  private storeContext?: StoreContext

  constructor(
    config: string | Phaser.Types.Scenes.SettingsConfig,
    private roomConfig: RoomConfig
  ) {
    super(config)

    console.log(
      '-------------------- initiate room scene ---------------------'
    )
    // @todo: multirooms?
    this.room = this.roomConfig.clients[0]?.rooms[0]
    this.gameObjectTypes = this.roomConfig.gameObjectTypes
    if (!this.room) {
      throw new Error('room not found')
    }

    this.players = this.room.players || []

    const currentUserId = localStorage.getItem('userId')

    // @todo: all players of a client
    this.zIndexer = new ZIndexer({ tileHeight: GAME_TILE_HEIGHT })
    this.gameObjectFactory = new GameObjectFactory({
      scene: this,
      players: this.room.players,
      zIndexer: this.zIndexer,
    })
    this.gameObjectUpdater = new GameObjectsUpdater(this.gameObjectFactory)
  }

  public getMap() {
    return this.map
  }

  public recreateEasystarGrid() {
    this.easystar.setGrid(getGrid(this.map!.getLayer()))
  }

  public updateRoomTile() {
    this.graphQl?.mutate({
      mutation: changeRoomTile,
      variables: {
        id: this.room.id,
        tile: getGrid(this.map!.getLayer()),
      },
    })
  }

  public upsertGameObject(gameObject: GameObjectModel<Settings>) {
    return this.graphQl?.mutate({
      mutation: upsertGameObject,
      variables: {
        object: pick(gameObject, [
          'id',
          'tile',
          'room_id',
          'settings',
          'type_id',
        ]),
      },
    })
  }

  preload() {
    // this.load.tilemapTiledJSON('room-map', 'assets/tilemaps/room.json')
    this.gameObjectTypes.forEach(({ sprite }) => {
      this.load.spritesheet(sprite.name, sprite.url, sprite.settings)
    })
    this.load.image(ASSET_NAME_ROOM_TILE, 'assets/tilemaps/tilemap.png')
    this.room.players.forEach((player) =>
      this.load.spritesheet(
        player.sprite.name,
        player.sprite.url,
        player.sprite.settings
      )
    )
  }

  async create() {
    this.storeContext = this.registry.get(
      REGISTRY_STORE_CONTEXT
    ) as StoreContext
    if (!this.storeContext) {
      throw new Error('cannot find store context')
    }
    this.easystar = new easystarjs.js()
    this.graphQl = this.registry.get(
      REGISTRY_GRAPHQL_CLIENT
    ) as ApolloClient<InMemoryCache>
    const currentUserId = localStorage.getItem('userId')
    const currentPlayer = this.players.filter(
      (player: PlayerModel) => player.id === currentUserId
    )[0]
    cursors = this.input.keyboard.createCursorKeys()
    const tileMapData = this.room.tile
    if (!Array.isArray(tileMapData)) {
      throw new Error('invalid tilemap data')
    }
    this.createTilemap(tileMapData)
    // this.layer.setCollisionByProperty({ collides: true });
    // this.layer.setCollision(1);
    // this.layer.tilemap.putTileAt(, 10, 10);
    // this.map.putTileAt(1, 10, 10)
    // const tile = this.map.getTileAt(10, 10)
    // tile.properties = { collides: true }
    // playerMask = getMask(this);
    // playerImage.setMask(playerMask);
    // let position: { x: number; y: number }
    // if (currentPlayer.tile) {
    //   position = currentPlayer.tile
    // } else {
    //   position = this.determinePositionForPlayer(currentPlayer)
    //   this.updatePlayerPosition(currentPlayer.id, position)
    // }
    // this.otherPlayerGameObjects = this.otherPlayers.map((player) =>
    //   this.createOtherPlayer(player)
    // )
    console.log('subscribe to change edit mode')

    this.listenForChangeEditMode()
    this.listenForFreeOccupiedTiles()
    // this.listenForChangePlaceObjects()

    this.events.on(EVENT_GAME_OBJECT_CLICK, this.onGameObjectClick)
    this.input.on(PhaserEvents.POINTER_DOWN, this.movePlayer)

    this.cameraStartFollowPlayer()
    this.events.on(EVENT_CAMERA_START_FOLLOW_PLAYER, () => {
      this.cameraStartFollowPlayer()
    })
    this.recreateEasystarGrid()
    this.easystar.setAcceptableTiles([TILE_ID_FREE_PLACE])
    this.easystar.enableSync()

    this.game.events.on(
      EVENT_RECEIVED_USER_MEDIA_STREAM,
      (stream: MediaStream, playerId: string) => {
        console.log('received media stream for player', playerId)
        const foundPlayer = this.playerUpdater?.findGameObject<Player>(playerId)
        console.log('found player', foundPlayer)
        console.log('in', this.playerUpdater?.getGameObjects())
        foundPlayer?.initiateVideo(stream)
      }
    )
    this.game.registry.events.on(
      `changedata-${REGISTRY_PLAYER_MEDIA_STREAM}`,
      async (_game: Phaser.Game, stream: MediaStream) => {
        if (!stream || !this.player) {
          console.log(
            'received media stream but either player or stream are not ready'
          )
          return
        }
        console.log('stream', stream)
        console.log('received media stream for current player')
        await this.player.initiateVideo(stream)
      }
    )

    this.playerFactory = new PlayerFactory({
      scene: this,
      zIndexer: this.zIndexer,
      calculateWaypoints: initCalculateWaypoints(
        this.cameras.main,
        this.map!,
        this.easystar
      ),
      makeCollide: this.makeCollide,
    })
    this.playerUpdater = new GameObjectsUpdater(this.playerFactory)

    this.subscribeToChanges()

    this.cameras.main.roundPixels = true
  }

  private onGameObjectClick = (
    pointer: Input.Pointer,
    gameObject: PhaserGameObject & InteractionReceiver
  ) => {
    const isEditMode = this.game.registry.get(REGISTRY_IS_EDIT_MODE)
    if (isEditMode) {
      this.openGameObjectSettings(pointer, gameObject)
    } else {
      this.openInteractionMenu(gameObject)
    }
  }

  private subscribeToChanges() {
    const {
      playerStore: { player, players },
      gameObjectStore: { gameObjects },
    } = this.storeContext!

    autorun(this.updatePlayersInPlayerUpdater)

    // reaction(() => player, this.setupPlayer, { fireImmediately: true })
    autorun(this.setupPlayer)

    autorun(this.updateGameObjects)

    autorun(this.updateRoom)

    // if (!this.graphQl) {
    //   return console.error('cannot find graph ql client')
    // }
    // const currentUserId = localStorage.getItem('userId')
    // if (!currentUserId) {
    //   throw new Error('current user id not found')
    // }
    // this.graphQl
    //   .subscribe<{ player: PlayerModel[] }>({
    //     query: subscribeToPlayersOfRoom,
    //     variables: { room_id: this.room.id },
    //   })
    //   .subscribe(
    //     ({ data }) => {
    //       console.log('player updates', data)
    //       if (!data) {
    //         return
    //       }
    //       const currentPlayerModel = data.player.find(
    //         (player) => player.id === currentUserId
    //       )
    //       this.playerUpdater?.update(
    //         data.player.filter((player) => !!player.tile)
    //       )

    //       if (currentPlayerModel && !currentPlayerModel.tile) {
    //         const position = this.determinePositionForPlayer(currentPlayerModel)
    //         this.updatePlayerPosition(currentPlayerModel.id, position)
    //         return
    //       }

    //       if (!this.player && currentUserId) {
    //         this.player = this.playerUpdater?.findGameObject<Player>(
    //           currentUserId
    //         )
    //         console.log('found player', this.player)

    //         if (!this.player) {
    //           return console.error('current player not found :*(')
    //         }
    //         const mediaStream: MediaStream = this.game.registry.get(
    //           REGISTRY_PLAYER_MEDIA_STREAM
    //         )
    //         if (mediaStream) {
    //           this.player.initiateVideo(mediaStream)
    //         }
    //         this.cameraStartFollowPlayer()
    //       }
    //     },
    //     (error) => {
    //       console.log('on error', error)
    //     }
    //   )

    // this.graphQl
    //   .subscribe({
    //     query: subscribeToGameObjectsOfRoom,
    //     variables: { room_id: this.room.id },
    //   })
    //   .subscribe(({ data }) => {
    //     console.log('game objects changed', data)
    //     this.gameObjectUpdater.update(data.gameobject)
    //     const gameObjectInInteraction = this.gameObjectUpdater
    //       .getGameObjects()
    //       .find(
    //         (gameObject) => gameObject.getModel().player_id === currentUserId
    //       )

    //     if (gameObjectInInteraction) {
    //       this.listenForInteractionRelease(
    //         gameObjectInInteraction as PhaserGameObject & InteractionReceiver
    //       )
    //     }
    //   })

    // this.graphQl
    //   .subscribe<{ room: Room[] }>({
    //     query: subscribeToRoom,
    //     variables: { room_id: this.room.id },
    //   })
    //   .subscribe(({ data }) => {
    //     console.log('room gets updated', data)
    //     if (this.map && data) {
    //       let y = 0
    //       data.room[0].tile.forEach((tileIndexes) => {
    //         let x = 0
    //         tileIndexes.forEach((index) => {
    //           this.map?.putTileAt(index, x, y)
    //           x++
    //         })
    //         y++
    //       })
    //       this.recreateEasystarGrid()
    //       // console.log('destorying existing map')
    //       // this.map.destroy()
    //       // console.log('recreating map')
    //       // this.createTilemap(data?.room[0].tile)
    //     }
    //   })
  }

  private setupPlayer = async () => {
    const {
      playerStore: { player },
    } = this.storeContext!

    console.log('setupPlayer', player)
    if (!player) {
      console.log('received undefined player', player)
      return
    }
    // player found but has not tile -> determine position first and skip rest of code
    if (player && !player.tile) {
      const position = this.determinePositionForPlayer(player)
      this.updatePlayerPosition(player.id, position)
      return
    }

    if (!this.player) {
      this.player = this.playerUpdater?.findGameObject<Player>(player.id)
      console.log('found player', this.player)

      if (!this.player) {
        return console.error('current player not found :*(')
      }
      const mediaStream: MediaStream = this.game.registry.get(
        REGISTRY_PLAYER_MEDIA_STREAM
      )
      this.cameraStartFollowPlayer()
      if (mediaStream) {
        await this.player.initiateVideo(mediaStream)
      }
    }
  }

  private updatePlayersInPlayerUpdater = () => {
    const {
      playerStore: { players },
    } = this.storeContext!
    console.log('received update for players', players)
    this.playerUpdater?.update(players.filter((player) => !!player.tile))
  }

  private updateGameObjects = () => {
    const {
      gameObjectStore: { gameObjects },
    } = this.storeContext!
    const currentUserId = localStorage.getItem('userId')
    this.gameObjectUpdater.update(gameObjects)
    const gameObjectInInteraction = this.gameObjectUpdater
      .getGameObjects()
      .find((gameObject) => gameObject.getModel().player_id === currentUserId)

    if (gameObjectInInteraction) {
      this.listenForInteractionRelease(
        gameObjectInInteraction as PhaserGameObject & InteractionReceiver
      )
    }
  }

  private updateRoom = () => {
    const {
      roomStore: { room },
    } = this.storeContext!

    if (this.map && room) {
      let y = 0
      room.tile.forEach((tileIndexes) => {
        let x = 0
        tileIndexes.forEach((index) => {
          this.map?.putTileAt(index, x, y)
          x++
        })
        y++
      })
      this.recreateEasystarGrid()
      // console.log('destorying existing map')
      // this.map.destroy()
      // console.log('recreating map')
      // this.createTilemap(data?.room[0].tile)
    }
  }

  private makeCollide = (player: Player) => {
    const playerContainer = player
    if (playerContainer) {
      this.physics.world.enable(playerContainer)
      this.physics.add.collider(playerContainer, this.layer!)
    }
  }

  private openInteractionMenu = (
    gameObject: PhaserGameObject & InteractionReceiver
  ) => {
    if (this.isInteractionMenuOpen) {
      return
    }
    const {
      gameobjectype: {
        sprite: { animations: gameObjectAnimations },
        name: gameObjectTypeName,
      },
    } = gameObject.getModel()
    const animations = getInteractionAnimations(
      gameObjectAnimations || [],
      getAnimationInteractionType(gameObjectTypeName)
    )

    this.isInteractionMenuOpen = true
    console.log('open menu and set', this.isInteractionMenuOpen)
    this.interactionMenu = new InteractionMenu({
      scene: this,
      entries: animations.map((animation) => ({
        name: animation.key,
        text: i18n.t(`interaction_${animation.key}`),
      })),
      x: gameObject.x,
      y: gameObject.y,
      zIndex: 100,
    })
    this.interactionMenu.onClose(() => {
      this.isInteractionMenuOpen = false
      this.interactionMenu = undefined
    })
    this.interactionMenu.onItemClick((entry) => {
      if (gameObject.isInteractionReceivable(this.player!)) {
        this.persistInteraction(entry, gameObject)
      } else {
        console.log('not possible to interact')
        return
      }
      this.interactionMenu?.close()
    })
  }

  private async persistInteraction(
    interaction: InteractionMenuEntry,
    gameObject: PhaserGameObject & InteractionReceiver
  ) {
    await this.movePlayerToTile(getInteractionTile(gameObject, this.getMap()!))
    const gameObjectSettings = gameObject.receiveInteraction(interaction)
    const playerInteraction = getInteractionForPlayer(interaction, gameObject)

    this.graphQl?.mutate({
      mutation: activateInteraction,
      variables: {
        playerId: this.player?.getModel().id,
        playerAnimation: playerInteraction.name,
        gameObjectId: gameObject.getModel().id,
        gameObjectPlayerId: this.player?.getModel().id,
        gameObjectAnimation: interaction.name,
        gameObjectSettings,
      },
    })
    this.listenForInteractionRelease(gameObject)
  }

  private listenForInteractionRelease(
    gameObject: PhaserGameObject & InteractionReceiver
  ) {
    this.input.once(PhaserEvents.POINTER_DOWN, () =>
      this.releaseInteraction(gameObject)
    )
  }

  private releaseInteraction = (
    gameObject: PhaserGameObject & InteractionReceiver
  ) => {
    const settings = gameObject.stopInteraction()

    this.graphQl?.mutate({
      mutation: activateInteraction,
      variables: {
        playerId: this.player?.getModel().id,
        playerAnimation: null,
        gameObjectId: gameObject.getModel().id,
        gameObjectPlayerId: null,
        gameObjectAnimation: gameObject.getFollowUpAnimation(settings),
        gameObjectSettings: settings,
      },
    })
  }

  private listenForFreeOccupiedTiles() {
    this.game.events.on(EVENT_FREE_OCCUPIED_TILES, this.freeOccupiedTiles)
  }

  private freeOccupiedTiles = (occupiedTiles: OccupiedTile[]) => {
    console.log('freeOccupiedTiles', occupiedTiles)
    occupiedTiles.forEach((tile) =>
      this.map?.putTileAt(TILE_ID_FREE_PLACE, tile.x, tile.y)
    )
    this.updateRoomTile()
  }

  private openGameObjectSettings = (
    pointer: Phaser.Input.Pointer,
    gameObject: PhaserGameObject
  ) => {
    console.log('click?', gameObject.getModel())
    if (!this.game.registry.get(REGISTRY_IS_SETTINGS_MODAL_OPEN)) {
      this.game.events.emit(
        EVENT_OPEN_GAME_OBJECT_SETTINGS,
        gameObject.getModel()
      )
    }
  }

  private listenForChangeEditMode = () => {
    this.game.registry.events.on(
      `changedata-${REGISTRY_IS_EDIT_MODE}`,
      (game: Phaser.Game, isEditMode: boolean) => {
        console.log('edit mode change', isEditMode)
        if (isEditMode) {
          this.cameraStopFollowPlayer()
          this.input.off(PhaserEvents.POINTER_DOWN, this.movePlayer)
          this.events.off(EVENT_OPEN_INTERACTION_MENU, this.openInteractionMenu)
          this.listenForEditToolChange()
          this.listenForPlaceObjectChange()
        } else {
          console.log('start follow player')
          this.cameraStartFollowPlayer()
          this.input.on(PhaserEvents.POINTER_DOWN, this.movePlayer)
          this.events.on(EVENT_OPEN_INTERACTION_MENU, this.openInteractionMenu)
          this.stopListenForEditToolChange()
          this.stopListenForPlaceObjectChange()
          this.editTool?.stop()
          this.placeObject?.stop()
        }
      }
    )
  }

  cameraStartFollowPlayer = () => {
    const playerContainer = this.player
    if (playerContainer) {
      this.cameras.main.startFollow(playerContainer, true, 0.08, 0.08)
    }
    const devicePixelRatio = window.devicePixelRatio || 1
    // this.cameras.main.setZoom(devicePixelRatio)
    this.cameras.main.setZoom(1.2)
  }

  cameraStopFollowPlayer = () => {
    console.log('stop follow')
    this.cameras.main.stopFollow()
  }

  listenForEditToolChange = () => {
    this.registry.events.on(
      `changedata-${REGISTRY_CHANGE_EDIT_TOOL}`,
      this.changeEditTool
    )
  }

  stopListenForEditToolChange = () => {
    this.registry.events.off(
      `changedata-${REGISTRY_CHANGE_EDIT_TOOL}`,
      this.changeEditTool
    )
  }

  listenForPlaceObjectChange = () => {
    this.registry.events.on(
      `changedata-${REGISTRY_CHANGE_PLACE_OBJECTS}`,
      this.changePlaceObjects
    )
  }

  stopListenForPlaceObjectChange = () => {
    this.registry.events.off(
      `changedata-${REGISTRY_CHANGE_PLACE_OBJECTS}`,
      this.changePlaceObjects
    )
  }

  changeEditTool = (game: Phaser.Game, editToolType?: EditToolType) => {
    console.log('edit tool change detected', editToolType)
    this.editTool?.stop()
    if (editToolType !== undefined) {
      this.editTool = EditToolFactory.getInstance(editToolType)
      this.editTool?.start(this)
    }
  }

  changePlaceObjects = (
    _game: Phaser.Game,
    placeObjectType?: GameObjectType
  ) => {
    console.log('change place objects')
    this.placeObject?.stop()
    if (!placeObjectType) {
      console.log('place object type not defined')
      return
    }

    this.placeObject = new PlaceGameObject({
      gameObjectFactory: this.gameObjectFactory,
      roomId: this.room.id,
      type: placeObjectType,
      occupiedTilesCount: placeObjectType.settings.occupiedTilesCount,
    })
    this.placeObject.start(this)
    this.placeObject.onNewObjectPlaced(
      (gameObject: PhaserGameObject, occupiedTiles: OccupiedTile[]) =>
        this.onNewObjectPlaced(placeObjectType, gameObject, occupiedTiles)
    )
  }

  onNewObjectPlaced = async (
    placeObjectType: GameObjectType,
    gameObject: PhaserGameObject,
    occupiedTiles: OccupiedTile[]
  ) => {
    await this.addObjectToGame(placeObjectType, gameObject, occupiedTiles)
  }

  addObjectToGame = async (
    placeObjectType: GameObjectType,
    gameObject: PhaserGameObject,
    occupiedTiles: OccupiedTile[]
  ) => {
    const model: GameObjectModel<Settings> = {
      id: gameObject.getModel().id,
      tile: { x: gameObject.x, y: gameObject.y },
      room_id: this.room.id,
      type_id: placeObjectType.id,
      gameobjectype: placeObjectType,
      settings: { ...gameObject.getModel().settings, occupiedTiles },
    }
    gameObject.updateModel(model)
    await this.upsertGameObject(model)
    // if id is undefined game object is new and comes through subscription
    // so our current one can get destroyd
    if (model.id === undefined) {
      gameObject.destroy()
      // id is defined and thus it shall exist in game updater
    } else {
      this.gameObjectUpdater.addGameObject(gameObject)
    }
  }

  movePlayer = (
    pointer: Phaser.Input.Pointer,
    gameObjects: PhaserGameObject[]
  ) => {
    if (!this.canMovePlayer(gameObjects)) {
      return
    }
    const clickedTile = this.map!.getTileAtWorldXY(
      pointer.worldX,
      pointer.worldY,
      true,
      this.cameras.main,
      this.layer
    )

    if (!this.isTileValid(clickedTile)) {
      console.log('invalid tile', clickedTile)
      return
    }

    this.movePlayerToTile(clickedTile)
  }

  movePlayerToTile = (tile: Phaser.Tilemaps.Tile) => {
    const container = this.player
    if (!container) {
      throw new Error('player container not found')
    }
    const playerTile = this.map!.getTileAtWorldXY(
      container.x,
      container.y,
      true
    )

    if (!this.isTileValid(playerTile) || !this.isTileValid(tile)) {
      console.error('invalid tile found playerTile', playerTile)
      console.error('invalid tile found tile', tile)
      return
    }

    const newPosition = {
      x: tile.getCenterX(this.cameras.main),
      y: tile.getCenterY(this.cameras.main),
    }

    const playerModel = this.player!.getModel()
    this.player?.updateModel({ ...playerModel, tile: newPosition })

    this.updatePlayerPosition(localStorage.getItem('userId')!, newPosition)
    return this.player!.isMoveFinished()
  }

  isTileValid = (tile: Tilemaps.Tile) => {
    if (
      tile === undefined ||
      tile === null ||
      tile.x === undefined ||
      tile.y === undefined ||
      tile.index !== TILE_ID_FREE_PLACE
    ) {
      return false
    }
    return true
  }

  updatePlayerPosition = async (
    id: string,
    position: { x: number; y: number }
  ) => {
    await this.graphQl?.mutate({
      mutation: changePlayerPosition,
      variables: {
        id,
        tile: position,
      },
    })
  }

  // createOtherPlayer(player: PlayerModel) {
  //   const otherPlayer = new Player(this, player)
  //   const container = otherPlayer
  //   if (container) {
  //     this.physics.world.enable(container)
  //     this.physics.add.collider(container, this.layer!)
  //   }
  //   return otherPlayer
  // }

  update() {
    // this.player?.update(cursors)
    // this.otherPlayerGameObjects.forEach((player) => player.update(cursors))
  }

  determinePositionForPlayer(player: PlayerModel) {
    const possibleTiles = this.map!.filterTiles(
      (tile: Phaser.Tilemaps.Tile) => tile.index === TILE_ID_FREE_PLACE
    )
    if (possibleTiles.length === 0) {
      throw new Error('no possible tiles found! cannot get player position!')
    }
    const availableTiles = possibleTiles.filter(
      (tile) =>
        this.players.filter(
          (otherPlayer) =>
            otherPlayer.id !== player.id &&
            otherPlayer.tile &&
            otherPlayer.tile.x === tile.getCenterX(this.cameras.main) &&
            otherPlayer.tile.y === tile.getCenterY(this.cameras.main)
        ).length === 0
    )
    const tile = availableTiles[0]
    return {
      x: tile.getCenterX(this.cameras.main),
      y: tile.getCenterY(this.cameras.main),
    }
  }

  canMovePlayer = (gameObjects?: PhaserGameObject[]) => {
    return (
      !this.isInteractionMenuOpen && (!gameObjects || gameObjects.length === 0)
    )
  }

  createTilemap(tileMapData: number[][]) {
    this.map = this.make.tilemap({
      tileWidth: 30,
      tileHeight: 30,
      data: tileMapData,
    })

    const tileset = this.map.addTilesetImage(
      'room',
      ASSET_NAME_ROOM_TILE,
      30,
      30,
      1,
      2,
      0
    )

    tileset.firstgid = 1
    this.layer = this.map.createLayer(0, tileset, 0, 0)

    /**
     * setting collusion tiles. the tile ids are always one more than in tiled
     * for instance 0 in tiled is 1 in phaser
     */
    this.layer.setCollision([TILE_ID_WALL, TILE_ID_OCCUPIED])
  }
}
