import { TransformComponent } from '@taoro/component-transform-2d'
import { TextComponent } from '@taoro/renderer-2d'
import { CameraComponent } from '@taoro/renderer-raycaster-2d'

export function * Player(game) {
  // NOTA: Pueden existir componentes no vinculados a una tarea
  //       siempre y cuando posean un identificador de entidad.
  new TransformComponent('fps', {
    x: 10,
    y: 10,
  })
  new TextComponent('fps', {
    text: () => `FPS: ${game.frameCounter.framesPerSecond}`,
  })

  const transform = new TransformComponent('player', {
    x: 1.5,
    y: 1.5
  })
  const camera = new CameraComponent('player', {

  })

  while (true) {
    if (game.input.keyboard.isPressed('ArrowLeft')) {
      transform.rotation += 0.1
    } else if (game.input.keyboard.isPressed('ArrowRight')) {
      transform.rotation -= 0.1
    }

    if (game.input.keyboard.isPressed('ArrowUp') || game.input.keyboard.isPressed('KeyW')) {
      transform.position.addScaled(transform.direction, 0.1)
    } else if (game.input.keyboard.isPressed('ArrowDown') || game.input.keyboard.isPressed('KeyS')) {
      transform.position.addScaled(transform.direction, -0.1)
    }

    if (game.input.keyboard.isPressed('KeyA')) {
      transform.position.addScaled(camera.strafe, -0.1)
    } else if (game.input.keyboard.isPressed('KeyD')) {
      transform.position.addScaled(camera.strafe, 0.1)
    }
    yield
  }

  camera.unregister()
  transform.unregister()
}

export default Player
