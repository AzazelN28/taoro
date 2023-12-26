import { TransformComponent } from '@taoro/component-transform-2d'
import { TextComponent } from '@taoro/renderer-2d'
import { CameraComponent } from '@taoro/renderer-raycaster-2d'
import { ColliderComponent } from '@taoro/collider-raycaster-2d'

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
  const collider = new ColliderComponent('player', {
    radius: 0.25
  })

  while (true) {
    if (game.input.keyboard.isPressed('ArrowLeft')) {
      transform.rotation -= 0.05
    } else if (game.input.keyboard.isPressed('ArrowRight')) {
      transform.rotation += 0.05
    }

    collider.movement.reset()
    if (game.input.keyboard.isPressed('ArrowUp') || game.input.keyboard.isPressed('KeyW')) {
      collider.movement.addScaled(transform.direction, 0.05)
    } else if (game.input.keyboard.isPressed('ArrowDown') || game.input.keyboard.isPressed('KeyS')) {
      collider.movement.addScaled(transform.direction, -0.05)
    }

    if (game.input.keyboard.isPressed('KeyA')) {
      collider.movement.addScaled(camera.strafe, -0.05)
    } else if (game.input.keyboard.isPressed('KeyD')) {
      collider.movement.addScaled(camera.strafe, 0.05)
    }

    // camera.fieldOfView = Math.abs(Math.sin(game.loop.currentTime / 10000 * Math.PI * 2)) + 0.6
    yield
  }

  camera.unregister()
  transform.unregister()
}

export default Player
