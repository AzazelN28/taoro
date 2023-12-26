import { TransformComponent } from '@taoro/component-transform-2d'
import { AudioEmitterComponent, AudioEmitterState } from '@taoro/audio-3d'
import {
  SpriteComponent,
  transparentColor,
  createImageDataFromImage,
  createFastImageDataArrayFromImage,
} from '@taoro/renderer-raycaster-2d'
import { ColliderComponent } from '@taoro/collider-raycaster-2d'
import { Component } from '@taoro/component'

export const ItemType = {
  DEMO: 0,
  DEATH_CAM: 1,
  WATER: 2,
  BARREL: 3,
  TABLE: 4,
  LAMP: 5,
  CEIL_LAMP: 6,
  SKELETON: 7,
  DOG_FOOD: 8,
  COLUMN: 9,
  PLANT: 10,
  FLOOR_SKELETON: 11,

}

export function* Item(game, type = ItemType.WATER, x = 1.5, y = 1.5) {
  const id = Component.createId('item')
  const transform = new TransformComponent(id, {
    x,
    y,
  })
  const collider = new ColliderComponent(id, {
    radius: 0.25,
  })
  const image = game.resources.get('objects.png')
  const texture = createFastImageDataArrayFromImage(image, 64, 64, {
    columns: 5,
    rows: 10,
    stepWidth: 65,
    stepHeight: 65,
  })
  const sprite = new SpriteComponent(id, {
    texture: texture[type],
  })
  const emitter = new AudioEmitterComponent(id, {
    buffer: game.resources.get('beep.mp3?taoro:as=audiobuffer'),
    state: AudioEmitterState.STOPPED,
    loop: false
  })

  let running = true
  while (running) {
    if (collider.collisions.includes('player')) {
      emitter.state = AudioEmitterState.STARTED
      running = false
    }
    yield
  }

  Component.unregisterAllById(id)
}

export default Item
