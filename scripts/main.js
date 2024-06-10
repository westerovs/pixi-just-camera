import {Application, Rectangle, Container, Sprite, Texture, Graphics} from '../assets/lib/pixi.mjs'
import {assetsMap} from './assetsMap.js'
import {config} from './config.js'

const App = new Application(config)
document.body.appendChild(App.view)

class Game {
  constructor() {
    this.app = App
    this.blockA = null
    this.blockB = null
    this.blockC = null
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
    this.createContainers()

    this.createLine(this.blockC, this.blockA)

    gsap.to([this.blockA, this.blockB], {x: 200, yoyo: true, repeat: -1, duration: 2, ease: 'none'})

    console.log(this.blockA.getGlobalPosition())
    console.log(this.blockB.getGlobalPosition())
    console.log(this.blockC.getGlobalPosition())
  }

  createContainers = () => {
    const containerRed = this.createContainer3(0, 0)
    const containerGreen = this.createContainer1(100, 200)
    const containerBlue = this.createContainer2(700, 0)

    this.app.stage.addChild(containerRed)
    containerRed.addChild(containerGreen)
    containerRed.addChild(containerBlue)

    this.blockA = containerGreen.getChildByName('blockA')
    this.blockB = containerBlue.getChildByName('blockB')
    this.blockC = this.createSprite('blockC', 900, 900)
    this.app.stage.addChild(this.blockC)
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

    const block = this.createSprite('blockA', 100, 100)
    block.name = 'blockA'
    container.addChild(block)

    return container
  }

  createContainer2 = (x = 0, y = 0) => {
    const container = new Container()
    container.position.set(x, y)

    const sprite = this.createSprite('container2')
    container.addChild(sprite)

    const block = this.createSprite('blockB', 100, 100)
    block.name = 'blockB'
    container.addChild(block)

    return container
  }

  createSprite = (texture, x = 0, y = 0) => {
    const sprite = new Sprite(Texture.from(texture))
    sprite.position.set(x, y)
    return sprite
  }

  createLine(itemStart, itemEnd) {
    const line = new Graphics()
    line.lineStyle(6, 0xFF0000)
    line.moveTo(itemStart.x + (itemStart.width / 2), itemStart.y + (itemStart.height / 2))
    line.lineTo(itemEnd.x  + (itemEnd.width / 2), itemEnd.y  + (itemEnd.height / 2))

    line.update = () => {
      line.clear()
      line.lineStyle(6, 0xFF0000)
      line.moveTo(itemStart.x + (itemStart.width / 2), itemStart.y + (itemStart.height / 2))
      line.lineTo(itemEnd.x  + (itemEnd.width / 2), itemEnd.y  + (itemEnd.height / 2))
    }
    setInterval(() => line.update(), 100)

    this.app.stage.addChild(line)
  }
}

new Game().init()

