import { Component } from '@taoro/component'
import { TransformComponent } from '@taoro/component-transform-2d'
import { RectComponent } from '@taoro/renderer-2d'
import { ColliderComponent } from '@taoro/collider-nano-2d'
import { Rect } from '@taoro/math-rect'
import { Point } from '@taoro/math-point'

export function* Pad(game, id, human = false) {
  const inputIndex = id === 'left' ? 0 : 1

  const rect = new RectComponent(id)
  rect.rect.set(-12, -64, 24, 128)

  const transform = new TransformComponent(id)
  if (id === 'left') {
    transform.position.set(32, game.viewport.currentHalfHeight)
  } else {
    transform.position.set(
      game.viewport.currentWidth - 32,
      game.viewport.currentHalfHeight
    )
  }

  const collider = new ColliderComponent(id, {
    tag: 0,
    target: 1,
    rects: [rect.rect.clone()]
  })

  const velocity = new Point(0, 0)

  while (true) {
    if (human) {
      if (game.input.stateOf(inputIndex, 'up') > 0.0) {
        --velocity.y
      } else if (game.input.stateOf(inputIndex, 'down') > 0.0) {
        ++velocity.y
      }
    } else {
      const ball = Component.findByIdAndConstructor(
        'ball',
        TransformComponent
      )
      if (ball.position.y < transform.position.y) {
        --velocity.y
      } else if (ball.position.y > transform.position.y) {
        ++velocity.y
      }
    }

    velocity.y *= 0.9
    transform.position.add(velocity)
    yield
  }

  rect.unregister()
  transform.unregister()
  collider.unregister()
}

export default Pad
