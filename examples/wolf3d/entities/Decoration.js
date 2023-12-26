import { TransformComponent } from '@taoro/component-transform-2d'
import { SpriteComponent, createFastImageDataArrayFromImage } from '@taoro/renderer-raycaster-2d'
import { ColliderComponent } from '@taoro/collider-raycaster-2d'
import { Component } from '@taoro/component'

export function * Decoration(game, x = 1.5, y = 1.5) {
  const id = Component.createId('decoration')
  const transform = new TransformComponent(id, {
    x,
    y
  })
  const collider = new ColliderComponent(id, {
    radius: 0.25
  })
  const image = game.resources.get('objects.png')
  const [texture] = createFastImageDataArrayFromImage(image, 64, 64, {
    columns: 1,
    rows: 1,
    stepWidth: 65,
    stepHeight: 65,
  })
  const sprite = new SpriteComponent(id, {
    texture,
  })

  while (true) {
    yield
  }

  Component.unregisterAllById(id)
}

export default Decoration
