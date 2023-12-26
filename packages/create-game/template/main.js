import './style.css'
import { Game } from '@taoro/game'
import { InputDevice } from '@taoro/input'
// import { TransformComponent } from '@taoro/component-transform-2d'
import { Renderer /*, TextComponent */ } from '@taoro/renderer-2d'
import { Collider } from '@taoro/collider-nano-2d'
import { Ball } from './entities/Ball.js'
import { Pad } from './entities/Pad.js'
import { Score } from './entities/Score.js'

/**
 * This is the entry point of the game.
 */
async function start() {
  // create a game instance.
  const canvas = document.querySelector('canvas')
  const game = new Game(canvas)

  // queue up resources to load.
  game.resources.load('fonts/Bitwise.ttf?taoro:family=bitwise')
  game.resources.load('coin.wav?taoro:as=audiobuffer')
  await game.resources.all()

  // create a renderer and a collider and add them to the pipeline.
  const collider = new Collider()
  const renderer = new Renderer(canvas)
  game.pipeline.unshift(() => collider.update())
  game.pipeline.push(() => renderer.update())

  // set input bindings
  game.input.setBindings(0, (state) => {
    if (state.index === 0) {
      return [
        [
          'up',
          [
            [InputDevice.KEYBOARD, ['KeyW']],
            [InputDevice.GAMEPAD, [0, 1, 1, -1]],
          ],
        ],
        [
          'down',
          [
            [InputDevice.KEYBOARD, ['KeyS']],
            [InputDevice.GAMEPAD, [0, 1, 1, 1]],
          ],
        ],
      ]
    } else if (state.index === 1) {
      return [
        ['up', [[InputDevice.KEYBOARD, ['ArrowUp']]]],
        ['down', [[InputDevice.KEYBOARD, ['ArrowDown']]]],
      ]
    }
  })

  const score = {
    left: 0,
    right: 0,
  }

  // NOTE: There may be components not linked to a task/entity
  //       as long as they have an entity identifier.
  /*
  new TransformComponent('fps', {
    x: 10,
    y: 10
  })
  new TextComponent('fps', {
    text: () => `FPS: ${game.frameCounter.framesPerSecond}`
  })
  */

  // window.addEventListener('error', () => )

  game.scheduler.add(Ball(game, score))
  game.scheduler.add(Pad(game, 'left', true))
  game.scheduler.add(Pad(game, 'right', false))
  game.scheduler.add(Score(game, score))

  game.start()
  // game.stop()
}

/**
 * We need to start the game after the user
 * has interacted with the page.
 */
const userGesture = document.querySelector('#user-gesture')
userGesture.onclick = () => {
  // userGesture.remove()
  userGesture.style.display = 'none'
  start()
}
