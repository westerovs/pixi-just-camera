import {Application, Rectangle, Container, Sprite, Texture} from '../assets/lib/pixi.mjs'
import {assetsMap} from './assetsMap.js'
import {createSprite} from './utils/utils.js'
import {config} from './config.js'

const App = new Application(config)
document.body.appendChild(App.view)

class Game {
  constructor() {
    this.app = App
  }

  preload() {
    assetsMap.sprites.forEach((value) =>
      this.app.loader.add(value.name, value.url))

    this.app.loader.onComplete.add(() => {
      this.startGame()
    })
  }

  init() {
    this.preload()
    this.app.loader.load()
  }

  startGame = () => {
    const containerGreen = this.createContainer1()
    const containerBlue = this.createContainer2(500, 0)

    const blockA = containerGreen.getChildByName('blockA')
    const blockB = containerBlue.getChildByName('blockB')

    console.log(blockA)
    console.log(blockB)
  }

  createContainer1 = (x = 0, y = 0) => {
    const container = new Container()
    container.position.set(x, y)

    const sprite = this.createSprite('container1')
    container.addChild(sprite)

    const block = this.createSprite('blockA')
    block.name = 'blockA'
    block.position.set(0)
    container.addChild(block)

    this.app.stage.addChild(container)

    return container
  }

  createContainer2 = (x = 0, y = 0) => {
    const container = new Container()
    container.position.set(x, y)

    const sprite = this.createSprite('container2')
    container.addChild(sprite)

    const block = this.createSprite('blockB')
    block.name = 'blockB'
    block.position.set(0)
    container.addChild(block)

    this.app.stage.addChild(container)

    return container
  }

  createSprite = (texture) => {
    const sprite = new Sprite(Texture.from(texture))
    return sprite
  }
}

new Game().init()

