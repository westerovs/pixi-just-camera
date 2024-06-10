import {Application, Rectangle, Container, Sprite, Texture} from '../assets/lib/pixi.mjs'
import {assetsMap} from './assetsMap.js'
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
    const containerRed = this.createContainer3(0, 0)
    this.app.stage.addChild(containerRed)

    const containerGreen = this.createContainer1()
    const containerBlue = this.createContainer2(700, 0)

    containerRed.addChild(containerGreen)
    containerRed.addChild(containerBlue)

    const blockA = containerGreen.getChildByName('blockA')
    const blockB = containerBlue.getChildByName('blockB')

    const blockC = this.createSprite('blockC')
    blockC.position.set(900)
    this.app.stage.addChild(blockC)
  }

  createContainer3 = (x = 0, y = 0) => {
    const container = new Container()
    container.position.set(x, y)

    const sprite = this.createSprite('container3')
    container.addChild(sprite)

    return container
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

    return container
  }

  createSprite = (texture) => {
    const sprite = new Sprite(Texture.from(texture))
    return sprite
  }
}

new Game().init()

