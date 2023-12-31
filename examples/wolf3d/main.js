import './style.css'
import { Game } from '@taoro/game'
import { InputDevice } from '@taoro/input'
import { Component } from '@taoro/component'
import { ViewportResizeMode } from '@taoro/viewport'
import { Renderer as RendererRaycaster2D, Level } from '@taoro/renderer-raycaster-2d'
import { Renderer as Renderer2D } from '@taoro/renderer-2d'
import { Collider } from '@taoro/collider-raycaster-2d'
import { Enemy } from './tasks/Enemy.js'
import { Player } from './tasks/Player.js'

async function start() {
  const canvas = document.querySelector('canvas')
  const game = new Game(canvas)
  const level = new Level(13, 13, [
    1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1,
    0, 0, 3, 0, 2, 3, 3, 0, 3, 0, 0, 0, 9,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8,
    1, 1, 2, 9, 1, 0, 0, 0, 1, 0, 2, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 9,
    1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 0, 9,
    5, 0, 3, 3, 3, 0, 0, 0, 1, 0, 3, 3, 1,
    5, 0, 3, 4, 1, 5, 6, 7, 1, 0, 1, 1, 1,
    5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9,
    5, 0, 0, 0, 4, 0, 5, 0, 1, 0, 0, 0, 9,
    5, 0, 3, 3, 3, 0, 0, 0, 1, 0, 3, 3, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ])
  const collider = new Collider({
    level
  })
  const rendererRaycaster2D = new RendererRaycaster2D(canvas, {
    level
  })
  const renderer2D = new Renderer2D(canvas, {
    clear: false
  })
  game.viewport.mode = ViewportResizeMode.NONE
  game.viewport.width = 320
  game.viewport.height = 200

  game.pipeline.unshift(() => collider.update())
  game.pipeline.push(() => rendererRaycaster2D.update())
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

  game.scheduler.add(Enemy(game))
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
