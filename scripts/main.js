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
    this.sceneContainer = new Container()
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
    this.app.stage.addChild(this.sceneContainer)
    this.createContainers()
    this.createCamera(500, 200)
    this.createCameraMask()

    const dotCenter = this.camera.getChildByName('dotCenter')

    this.createLine(dotCenter, this.blockA)
    this.createLine(dotCenter, this.blockB)
    this.createLine(dotCenter, this.blockC)

    const localPosition = this.getLocalPosition(this.blockB, this.blockA.parent)
    console.log(localPosition)

    const closestObject = this.findClosestObject(dotCenter, [this.blockA, this.blockB, this.blockC])
    console.log(`Closest object to dotCenter: ${closestObject.name}`)

    this.animateCameraToClosestObject(dotCenter, closestObject)
  }

  createContainers = () => {
    const containerRed = this.createContainer3(0, 0)
    const containerGreen = this.createContainer1(100, 200)
    const containerBlue = this.createContainer2(700, 0)

    this.sceneContainer.addChild(containerRed)
    containerRed.addChild(containerGreen)
    containerGreen.addChild(containerBlue)

    this.blockA = containerGreen.getChildByName('blockA')
    this.blockB = containerBlue.getChildByName('blockB')
    this.blockC = this.createSprite('blockC', 900, 900)
    this.sceneContainer.addChild(this.blockC)
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

    const block = this.createSprite('blockA', 200, 100)
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

  // ------------------ camera
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

  createCameraMask = () => {
    const mask = new Graphics()
    mask.beginFill(0xFFFFFF)
    mask.drawRect(0, 0, this.camera.width, this.camera.height)
    mask.endFill()

    this.camera.addChild(mask)
    this.sceneContainer.mask = mask

    // Добавляем черный фон за пределами камеры
    const blackBackground = new Graphics()
    blackBackground.beginFill(0x000000)
    blackBackground.drawRect(0, 0, this.app.view.width, this.app.view.height)
    blackBackground.endFill()
    this.app.stage.addChild(blackBackground)
    this.app.stage.addChild(this.sceneContainer)
  }

  // Метод для анимации камеры к ближайшему объекту
  animateCameraToClosestObject(dotCenter, closestObject) {
    const targetCenter = this.getCenter(closestObject)
    const dotCenterPos = this.getCenter(dotCenter)
    const currentCameraPos = this.camera.position

    // Смещение камеры к целевому объекту
    const offsetX = targetCenter.x - dotCenterPos.x
    const offsetY = targetCenter.y - dotCenterPos.y

    gsap.to(this.camera.position, {
      x: currentCameraPos.x + offsetX,
      y: currentCameraPos.y + offsetY,
      duration: 2,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut"
    })
  }


  // Метод для вычисления центра элемента
  getCenter(item) {
    const globalPosition = item.toGlobal(new Point())
    if (item.anchor) {
      // Если это спрайт, учитываем anchor
      return {
        x: globalPosition.x + item.width * (0.5 - item.anchor.x),
        y: globalPosition.y + item.height * (0.5 - item.anchor.y)
      }
    } else {
      // Если это контейнер, просто возвращаем глобальную позицию
      return {
        x: globalPosition.x + item.width / 2,
        y: globalPosition.y + item.height / 2
      }
    }
  }


  // Метод для вычисления расстояния между двумя точками
  calculateDistance(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
  }

  // Метод для нахождения ближайшего объекта к dotCenter
  findClosestObject(dotCenter, objects) {
    const dotCenterPos = this.getCenter(dotCenter)
    let closestObject = null
    let minDistance = Infinity

    objects.forEach(object => {
      const objectCenter = this.getCenter(object)
      const distance = this.calculateDistance(dotCenterPos, objectCenter)
      if (distance < minDistance) {
        minDistance = distance
        closestObject = object
      }
    })

    return closestObject
  }

}

new Game().init()

