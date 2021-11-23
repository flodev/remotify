var TWEEN = require('@tweenjs/tween.js')

class Container {}
class Sprite {}

var noop = function () {}
var Phaser = {}
Phaser.Easing = TWEEN.Easing
Phaser.TWEEN = TWEEN
Phaser.Input = {
  Events: {},
}
Phaser.GameObjects = {
  Container,
  Sprite,
}
Phaser.Game = function (width, height, renderer, parent) {
  if (typeof width === 'object') {
    var opts = width
    height = opts.height
    width = opts.width
    renderer = opts.renderer
    parent = opts.parent
  }
  this.width = width
  this.height = height
  this.renderer = renderer
  this.parent = parent

  this.state = new Phaser.StateManager()
  this.device = new Phaser.Device()
  this.add = new Phaser.GameObjectFactory()
  this.make = new Phaser.GameObjectCreator()
  this.time = new Phaser.Time()
  this.load = new Phaser.Loader()
  this.world = new Phaser.Group()
}
Phaser.GameObjectFactory = function () {
  this.audio = function () {
    return new Phaser.Sound()
  }
  this.sprite = function () {
    return new Phaser.Sprite()
  }
  this.group = function () {
    return new Phaser.Group()
  }
  this.tween = function (obj) {
    return new Phaser.Tween(obj)
  }
}
Phaser.GameObjectCreator = Phaser.GameObjectFactory
Phaser.Sound = function () {
  this.play = noop
  this.stop = noop
  this.fadeOut = noop
  this.fadeIn = noop
}
Phaser.StateManager = function () {
  this.add = noop
}
Phaser.State = function () {}
Phaser.Device = function () {
  this.whenReady = noop
}
Phaser.Signal = function () {
  var listener
  // NOTE: this is different from actual implementation
  // supports only one handler
  this.addOnce = this.add = function (cb) {
    listener = cb
  }
  this.dispatch = function () {
    if (listener) {
      listener()
    }
  }
}
Phaser.Group = function () {
  this.x = 0
  this.y = 0
  this.children = []
  this.add = function (child) {
    this.children.push(child)
  }
}
Phaser.Sprite = function () {
  this.x = 0
  this.y = 0
  this.anchor = { x: 0, y: 0 }
  this.loadTexture = noop
  this.key = ''
  this.frame = 0
}
Phaser.Time = function () {
  this.events = new Phaser.Timer()
}
Phaser.Timer = function () {
  this.add = function (time, fn, ctx) {
    var args = [].slice.call(arguments, 3)
    setTimeout(function () {
      fn.apply(ctx, args)
    }, time)
  }
}
Phaser.Loader = function () {
  this.baseURL = ''
  this.image = noop
  this.atlas = noop
  this.audio = noop
  this.onLoadComplete = new Phaser.Signal()
  this.start = function () {
    setTimeout(
      function () {
        this.onLoadComplete.dispatch()
      }.bind(this),
      0
    )
  }
}
Phaser.Tween = function (obj) {
  var t = new TWEEN.Tween(obj)
  var result = {
    start: function (time) {
      t.start(time)
      return result
    },
    to: function (values, duration, easing, delay, repeat, yoyo) {
      result.vEnd = values
      result.duration = duration
      result.easingFunction = easing
      result.delay = delay
      result.repeatTotal = repeat
      result.yoyo = yoyo

      t.to(values, duration)
      t.easing(easing)
      t.delay(delay)
      // TWEEN does not understand repeat === -1
      t.repeat(repeat === -1 ? 100 : repeat)
      t.yoyo(yoyo)
      return result
    },
    onComplete: (function () {
      var signal = new Phaser.Signal()
      signal.add = signal.addOnce = function (cb) {
        t.onComplete(function () {
          cb()
        })
        signal.dispatch = function () {
          cb()
        }
      }
      return signal
    })(),
    onUpdateCallback: function (cb) {
      t.onUpdate(cb)
      return result
    },
    stop: function (complete) {
      t.stop()
      if (complete) {
        result.onComplete.dispatch()
      }
      return result
    },
  }
  return result
}
Phaser.Filter = noop

module.exports = Phaser
