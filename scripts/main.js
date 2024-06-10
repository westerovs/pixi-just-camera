import {Application, Rectangle, Container, Sprite, Texture, Graphics, Point} from '../assets/lib/pixi.mjs'
import {assetsMap} from './assetsMap.js'
import {config} from './config.js'

const App = new Application(config)
document.body.appendChild(App.view)

class Game {
  constructor() {
    this.app = App
    this.camera = new Container()
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
    this.createCamera(500, 200)

    const dotCenter = this.camera.getChildByName('dotCenter')

    this.createLine(dotCenter, this.blockA)
    this.createLine(dotCenter, this.blockB)
    this.createLine(dotCenter, this.blockC)

    const localPosition = this.getLocalPosition(this.blockB, this.blockA.parent)
    console.log(localPosition)
  }

  createContainers = () => {
    const containerRed = this.createContainer3(0, 0)
    const containerGreen = this.createContainer1(100, 200)
    const containerBlue = this.createContainer2(700, 0)

    this.app.stage.addChild(containerRed)
    containerRed.addChild(containerGreen)
    containerGreen.addChild(containerBlue)

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

    const getCenter = (item) => {
      const globalPosition = item.toGlobal(new Point())
      const anchorX = item.anchor ? item.anchor.x : 0
      const anchorY = item.anchor ? item.anchor.y : 0
      return {
        x: globalPosition.x + item.width * (0.5 - anchorX),
        y: globalPosition.y + item.height * (0.5 - anchorY)
      }
    }

    const startCenter = getCenter(itemStart)
    const endCenter = getCenter(itemEnd)

    line.moveTo(startCenter.x, startCenter.y)
    line.lineTo(endCenter.x, endCenter.y)

    line.update = () => {
      line.clear()
      line.lineStyle(6, 0xFF0000)
      const startCenter = getCenter(itemStart)
      const endCenter = getCenter(itemEnd)
      line.moveTo(startCenter.x, startCenter.y)
      line.lineTo(endCenter.x, endCenter.y)
    }

    setInterval(() => line.update(), 100)

    this.app.stage.addChild(line)
  }

  getLocalPosition(target, container) {
    const globalPosition = target.getGlobalPosition()
    return container.toLocal(globalPosition)
  }

  createCamera = (x = 0, y = 0) => {
    this.app.stage.addChild(this.camera)
    const sprite = this.createSprite('cameraContainer')
    this.camera.addChild(sprite)

    const dotCenter = this.createSprite('dotCenter')
    dotCenter.name = 'dotCenter'
    dotCenter.position.set(this.camera.width / 2, this.camera.height / 2)
    this.camera.addChild(dotCenter)

    this.camera.position.set(x, y)
  }
}

new Game().init()

