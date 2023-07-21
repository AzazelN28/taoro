import './style.css'
import { Game } from '@taoro/game'
import { InputDevice } from '@taoro/input'
import { Component } from '@taoro/component'
import { ViewportResizeMode } from '@taoro/viewport'
import { Renderer as RendererRaycaster, Level } from '@taoro/renderer-raycaster-2d'
import { Renderer as Renderer2D } from '@taoro/renderer-2d'
import { Collider } from '@taoro/collider-nano-2d'
import { Player } from './tasks/Player.js'

async function start() {
  const canvas = document.querySelector('canvas')
  const game = new Game(canvas)

  const collider = new Collider()
  const rendererRaycaster = new RendererRaycaster(canvas, {
    level: new Level(13, 13, [
    //0  1  2  3  4  5  6  7  8  9  0  1  2
      1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1,
      2, 0, 2, 0, 2, 3, 3, 0, 3, 0, 0, 0, 9,
      5, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 8, 8,
      5, 5, 2, 0, 1, 0, 0, 0, 1, 0, 2, 1, 1,
      5, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 9,
      1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 0, 9,
      5, 0, 3, 3, 3, 0, 0, 0, 1, 0, 3, 3, 1,
      5, 0, 3, 4, 1, 5, 6, 7, 1, 0, 1, 1, 1,
      5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9,
      5, 0, 0, 0, 4, 0, 5, 0, 1, 0, 0, 0, 9,
      5, 0, 3, 3, 3, 0, 0, 0, 1, 0, 3, 3, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ])
  })
  const renderer2D = new Renderer2D(canvas, {
    clear: false
  })
  game.viewport.mode = ViewportResizeMode.NONE
  game.viewport.width = 320
  game.viewport.width = 200

  game.pipeline.unshift(() => collider.update())
  game.pipeline.push(() => rendererRaycaster.update())
  game.pipeline.push(() => renderer2D.update())

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

  // TODO: Ver como meto esto en un sistema.
  window.addEventListener('error', () => {
    console.log(Component.getComponentsByConstructor())
    console.log(Component.getComponentsById())
  })

  game.scheduler.add(Player(game))

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
