import './style.css'
import { Game } from '@taoro/game'
import { InputDevice } from '@taoro/input'
import { Component } from '@taoro/component'
// import { TransformComponent } from '@taoro/component-transform-2d'
import { Renderer /*, TextComponent */ } from '@taoro/renderer-2d'
import { Collider } from '@taoro/collider-nano-2d'
import { Ball } from './entities/Ball.js'
import { Pad } from './entities/Pad.js'
import { Score } from './entities/Score.js'

async function start() {

  const canvas = document.querySelector('canvas')
  const game = new Game(canvas)

  game.resources.load('fonts/Bitwise.ttf?taoro:family=bitwise')
  game.resources.load('coin.wav?taoro:as=audiobuffer')
  await game.resources.all()

  const collider = new Collider()
  const renderer = new Renderer(canvas)
  game.pipeline.unshift(() => collider.update())
  game.pipeline.push(() => renderer.update())

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
    right: 0
  }

  // NOTA: Pueden existir componentes no vinculados a una tarea
  //       siempre y cuando posean un identificador de entidad.
  /*
  new TransformComponent('fps', {
    x: 10,
    y: 10
  })
  new TextComponent('fps', {
    text: () => `FPS: ${game.frameCounter.framesPerSecond}`
  })
  */

  // TODO: Ver como meto esto en un sistema.
  window.addEventListener('error', () => {
    console.log(Component.getComponentsByConstructor())
    console.log(Component.getComponentsById())
  })

  game.scheduler.add(Ball(game, score))
  game.scheduler.add(Pad(game, 'left', true))
  game.scheduler.add(Pad(game, 'right', false))
  game.scheduler.add(Score(game, score))

  game.start()
  // game.stop()

}

/**
 * Esto podría hacer muchas más cosas: por ejemplo, cargar
 * el script del juego y luego llamar a start() cuando esté
 * listo.
 *
 * También se podría utilizar esto como una oportunidad para
 * darle opciones al jugador de qué es lo que debería ocurrir
 * al arrancar el juego: con/sin sonido, con/sin música, etc.
 */
const userGesture = document.querySelector('#user-gesture')
userGesture.onclick = () => {
  // userGesture.remove()
  userGesture.style.display = 'none'
  start()
}
