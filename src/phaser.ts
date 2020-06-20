// @ts-nocheck
import Phaser from "phaser";
import logoImg from "./icon.png";
import "webrtc-adapter";
import { RoomScene } from "./scenes/room";

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

const config = {
  type: Phaser.WEBGL,
  parent: "phaser-example",
  width: "100%",
  height: "100%",
  dom: {
    createContainer: true,
  },
  // plugins: {
  //   global: [{ key: "VideoStreamPlugin", plugin: VideoStreamPlugin, start: true }],
  // },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: RoomScene,
};

new Phaser.Game(config);
