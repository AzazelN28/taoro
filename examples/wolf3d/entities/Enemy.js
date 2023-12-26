import { TransformComponent } from '@taoro/component-transform-2d'
import { AudioEmitterComponent, AudioEmitterState } from '@taoro/audio-3d'
import { SpriteComponent, transparentColor, createImageDataFromImage, createFastImageDataArrayFromImage } from '@taoro/renderer-raycaster-2d'
import { ColliderComponent } from '@taoro/collider-raycaster-2d'
import { Component } from '@taoro/component'

export function * Enemy(game, x = 1.5, y = 1.5, rotation = 0) {
  const id = Component.createId('enemy')
  /*
  const emitter = new AudioEmitterComponent(id, {
    buffer: game.resources.get('beep.mp3?taoro:as=audiobuffer'),
    state: AudioEmitterState.STARTED
  })
  */
  const transform = new TransformComponent(id, {
    x,
    y,
    rotation
  })
  const image = game.resources.get('guard.png')
  const texture = createFastImageDataArrayFromImage(
    image,
    64,
    64,
    { columns: 8, rows: 1, stepWidth: 65, stepHeight: 65 }
  )
  const sprite = new SpriteComponent(id, {
    texture
  })
  const collider = new ColliderComponent(id, {
    radius: 0.25
  })

  while (true) {
    const playerTransform = Component.findByIdAndConstructor(
      'player',
      TransformComponent
    )
    if (playerTransform) {
      const distanceToPlayer = transform.position.distanceTo(playerTransform.position)
      if (distanceToPlayer > 1) {
        transform.rotation = transform.position.angleTo(playerTransform.position)
        transform.position.addScaled(transform.direction, 0.01)
      }
    }
    yield
  }

  Component.unregisterAllById(id)
}

export default Enemy
