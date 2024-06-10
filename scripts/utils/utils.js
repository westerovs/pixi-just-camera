import { Graphics, Sprite, Texture } from '../../assets/lib/pixi.mjs';

const createSprite = (container, textureName, params = {}) => {
  const {
    position = {x: 0, y: 0},
    anchor = {x: 0.5, y: 0.5},
    interactive = true,
  } = params

  const sprite = new Sprite(Texture.from(textureName))
  sprite.position.copyFrom(position)
  sprite.anchor.copyFrom(anchor)
  sprite.interactive = interactive

  container.addChild(sprite)

  return sprite
}

export {
  createSprite,
}
