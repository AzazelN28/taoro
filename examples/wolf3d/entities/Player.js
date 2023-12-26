import { TransformComponent } from '@taoro/component-transform-2d'
import { TextComponent } from '@taoro/renderer-2d'
import { CameraComponent } from '@taoro/renderer-raycaster-2d'
import { ColliderComponent } from '@taoro/collider-raycaster-2d'
import { Component } from '@taoro/component'
import { AudioListenerComponent } from '@taoro/audio-3d'
import { Enemy } from './Enemy.js'

export function * Player(game) {
  // NOTA: Pueden existir componentes no vinculados a una tarea
  //       siempre y cuando posean un identificador de entidad.
  new TransformComponent('fps', {
    x: 10,
    y: 10,
  })
  new TextComponent('fps', {
    text: () => `FPS: ${game.frameCounter.framesPerSecond}, ${transform.position.x.toFixed(2)}, ${transform.position.y.toFixed(2)}`,
  })

  const listener = new AudioListenerComponent('player')
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
    if (game.input.stateOf(0, 'turn-left')) {
      transform.rotation -= 0.05
    } else if (game.input.stateOf(0, 'turn-right')) {
      transform.rotation += 0.05
    }

    collider.movement.reset()
    if (game.input.stateOf(0, 'forward')) {
      collider.movement.addScaled(transform.direction, 0.05)
    } else if (game.input.stateOf(0, 'backward')) {
      collider.movement.addScaled(transform.direction, -0.05)
    }

    if (game.input.stateOf(0, 'strafe-left')) {
      collider.movement.addScaled(camera.strafe, -0.05)
    } else if (game.input.stateOf(0, 'strafe-right')) {
      collider.movement.addScaled(camera.strafe, 0.05)
    }

    if (game.input.stateOf(0, 'fire')) {
      game.scheduler.add(Enemy(game, transform.position.x, transform.position.y, transform.rotation))
    }

    // camera.fieldOfView = Math.abs(Math.sin(game.loop.currentTime / 10000 * Math.PI * 2)) + 0.6
    yield
  }

  Component.unregisterAllById('player')
}

export default Player
