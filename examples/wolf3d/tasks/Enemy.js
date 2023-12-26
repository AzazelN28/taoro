import { TransformComponent } from '@taoro/component-transform-2d'
import { SpriteComponent } from '@taoro/renderer-raycaster-2d'
import { ColliderComponent } from '@taoro/collider-raycaster-2d'

export function * Enemy(game) {
  const transform = new TransformComponent('enemy', {
    x: 1.5,
    y: 1.5,
  })
  const sprite = new SpriteComponent('enemy', {})

  while (true) {
    transform.position.x += 0.01
    yield
  }

  transform.unregister()
  sprite.unregister()
}

export default Enemy
