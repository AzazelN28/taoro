import './style.css'
import { Game } from '@taoro/game'
import { Audio3D } from '@taoro/audio-3d'
import { InputDevice, InputKind } from '@taoro/input'
import { Component } from '@taoro/component'
import { ViewportResizeMode } from '@taoro/viewport'
import { Renderer as RendererRaycaster2D, Level } from '@taoro/renderer-raycaster-2d'
import { Renderer as Renderer2D } from '@taoro/renderer-2d'
import { Collider } from '@taoro/collider-raycaster-2d'
import { Enemy } from './entities/Enemy.js'
import { Player } from './entities/Player.js'
import { Decoration } from './entities/Decoration.js'
import { Item, ItemType } from './entities/Item.js'

async function start() {

  const canvas = document.querySelector('canvas')

  const game = new Game(canvas)
  await game.resources.load('walls.png')
  await game.resources.load('objects.png')
  await game.resources.load('guard.png')
  await game.resources.load('beep.mp3?taoro:as=audiobuffer')

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
  const textures = game.resources.get('walls.png')
  const rendererRaycaster2D = new RendererRaycaster2D(canvas, {
    level,
    textures
  })
  const audio3D = new Audio3D(game.audio)
  const renderer2D = new Renderer2D(canvas, {
    clear: false
  })
  game.viewport.mode = ViewportResizeMode.NONE
  game.viewport.width = 320
  game.viewport.height = 200

  // Configuramos los nuevos elementos del pipeline.
  game.pipeline.push(() => audio3D.update())
  game.pipeline.unshift(() => collider.update())
  game.pipeline.push(() => rendererRaycaster2D.update())
  game.pipeline.push(() => renderer2D.update())

  game.input.setBindings(0, (state) => {
    if (state.index === 0) {
      return [
        [
          'forward',
          [
            [InputDevice.KEYBOARD, ['KeyW']],
            [InputDevice.KEYBOARD, ['ArrowUp']],
            [InputDevice.GAMEPAD, [0, InputKind.AXIS, 1, -1]],
          ],
        ],
        [
          'backward',
          [
            [InputDevice.KEYBOARD, ['KeyS']],
            [InputDevice.KEYBOARD, ['ArrowDown']],
            [InputDevice.GAMEPAD, [0, InputKind.AXIS, 1, 1]],
          ],
        ],
        [
          'turn-left',
          [
            [InputDevice.KEYBOARD, ['ArrowLeft']],
            [InputDevice.GAMEPAD, [0, InputKind.AXIS, 3, -1]],
          ],
        ],
        [
          'turn-right',
          [
            [InputDevice.KEYBOARD, ['ArrowRight']],
            [InputDevice.GAMEPAD, [0, InputKind.AXIS, 3, 1]],
          ],
        ],
        [
          'strafe-left',
          [
            [InputDevice.KEYBOARD, ['KeyA']],
            [InputDevice.GAMEPAD, [0, InputKind.AXIS, 0, -1]],
          ],
        ],
        [
          'strafe-right',
          [
            [InputDevice.KEYBOARD, ['KeyD']],
            [InputDevice.GAMEPAD, [0, InputKind.AXIS, 0, 1]],
          ],
        ],
        [
          'fire',
          [
            [InputDevice.KEYBOARD, ['Space']],
            [InputDevice.GAMEPAD, [0, InputKind.BUTTON, 0]],
          ],
        ],
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
  game.scheduler.add(Decoration(game, 6.5, 4.5))
  game.scheduler.add(Item(game, ItemType.DOG_FOOD, 5.5, 4.5))

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
