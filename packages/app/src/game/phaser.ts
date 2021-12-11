// @ts-nocheck
import Phaser from 'phaser'
import logoImg from './icon.png'
import 'webrtc-adapter'
import { RootScene } from './scenes/RootScene'
import * as GameEvents from '../frontend/app/GameEvents'
import * as RegistryKeys from '../constants/registry'
import { REGISTRY_GRAPHQL_CLIENT, REGISTRY_STORE_CONTEXT } from '../constants'
import { GAME_CANVAS_ID } from '../constants'
import { GameObjectStore, StoreContext } from '../state'

// class VideoStreamPlugin extends Phaser.Plugins.BasePlugin {

//   constructor (pluginManager)
//   {
//       super(pluginManager);

//       //  Register our new Game Object type
//       pluginManager.registerGameObject('videoStream', this.createStream);
//   }

//   createStream (x, y)
//   {
//       return this.displayList.add(new ClownGameObject(this.scene, x, y));
//   }

// }

const initializeRegistryKeys = (registry: Phaser.Data.DataManager) => {
  Object.keys(RegistryKeys).forEach((registryKey) =>
    registry.set(registryKey, undefined)
  )
}

export const initiateGame = (
  graphQl: ApolloClient,
  storeContext: StoreContext
) => {
  const canvas = document.getElementById(GAME_CANVAS_ID)
  const desiredWidth = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  )
  const desiredHeight = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  )
  const devicePixelRatio = window.devicePixelRatio || 1

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: desiredWidth * devicePixelRatio,
    height: desiredHeight * devicePixelRatio,
    // fps: {
    //   target: 30, // 30x per second
    // },
    canvas,
    // dom: {
    //   createContainer: true,
    // },
    antialias: true,
    antialiasGL: true,
    canvasStyle: `width: 100%; height: 100%`,
    // plugins: {
    //   global: [{ key: "VideoStreamPlugin", plugin: VideoStreamPlugin, start: true }],
    // },
    physics: {
      default: 'arcade',
      arcade: {
        // debug: true,
        gravity: { y: 0 },
      },
    },
    scene: RootScene,
  }

  const game = new Phaser.Game(config)
  initializeRegistryKeys(game.registry)
  game.registry.set(REGISTRY_GRAPHQL_CLIENT, graphQl)
  game.registry.set(REGISTRY_STORE_CONTEXT, storeContext)
  return game
}
