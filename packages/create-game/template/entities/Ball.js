import { TransformComponent } from '@taoro/component-transform-2d'
import { RectComponent } from '@taoro/renderer-2d'
import { ColliderComponent } from '@taoro/collider-nano-2d'
import { Rect } from '@taoro/math-rect'
import { Point } from '@taoro/math-point'

export function * Ball(game, score) {
  const rect = new RectComponent('ball')
  rect.rect.set(-8, -8, 16, 16)

  const transform = new TransformComponent('ball')
  transform.position.set(
    game.viewport.currentHalfWidth,
    game.viewport.currentHalfHeight
  )

  const collider = new ColliderComponent('ball', {
    tag: 1,
    rects: [rect.rect.clone()]
  })

  const velocity = new Point(4, 4)

  while (true) {
    if (collider.hasCollided) {
      if (collider.collidesWithId('left')) {
        velocity.x = 4
      } else {
        velocity.x = -4
      }
      game.sound.play(game.resources.get('coin.wav?taoro:as=audiobuffer'), {
        playbackRate: 0.5
      })
    }

    if (transform.position.x > game.viewport.currentWidth) {
      ++score.left
      transform.position.set(
        game.viewport.currentHalfWidth,
        game.viewport.currentHalfHeight
      )
      velocity.set(-4, 4)
      game.sound.play(game.resources.get('coin.wav?taoro:as=audiobuffer'), {
        playbackRate: 0.125,
      })
    } else if (transform.position.x < 0) {
      ++score.right
      transform.position.set(
        game.viewport.currentHalfWidth,
        game.viewport.currentHalfHeight
      )
      velocity.set(4, 4)
      game.sound.play(game.resources.get('coin.wav?taoro:as=audiobuffer'), {
        playbackRate: 0.125,
      })
    }

    if (
      transform.position.y > game.viewport.currentHeight - 4 ||
      transform.position.y < 4
    ) {
      velocity.y *= -1

      game.sound.play(game.resources.get('coin.wav?taoro:as=audiobuffer'))
    }

    transform.position.add(velocity)
    yield
  }

  rect.unregister()
  transform.unregister()
  collider.unregister()
}

export default Ball
