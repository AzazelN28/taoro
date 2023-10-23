import { Component } from '@taoro/component'
import { AudioChannelName } from '@taoro/audio-channel'
import { TransformComponent as TransformComponent2D } from '@taoro/component-transform-2d'
// import { TransformComponent as TransformComponent3D } from '@taoro/component-transform-3d'

export class AudioListener extends Component {
  constructor(id) {
    super(id)
    this.forward = new Vector3()
    this.up = new Vector3()
  }
}

export class AudioEmitter extends Component {
  constructor(id) {
    super(id)
  }
}

export class Audio3D {
  #audio = null
  #channelName = AudioChannelName.SFX

  /**
   * Transform component that we're going to use as
   * the positional source for the spatial audio.
   *
   * @type {Function}
   */
  #transform = null

  /**
   * Constructor
   *
   * @param {Audio} audio
   * @param {Audio3DOptions} options
   */
  constructor(audio, options) {
    this.#audio = audio
    this.#channelName = options?.channelName ?? AudioChannelName.SFX
    this.#transform = options?.transform ?? TransformComponent2D
  }

  update() {
    const listeners = Component.findByConstructor(AudioListener)
    if (!listeners) {
      return
    }

    const emitters = Component.findByConstructor(AudioEmitter)
    if (!emitters) {
      return
    }

    // Sólo puede haber un listener.
    const [listener] = listeners
    const transform = Component.findByIdAndConstructor(listener.id, this.#transform)
    listener.forward.x = transform.forward.x
    listener.forward.y = transform.forward.y
    listener.forward.z = transform.forward.z
    listener.position.x = transform.position.x
    listener.position.y = transform.position.y
    listener.position.z = transform.position.z
    listener.up.x = transform.up.x
    listener.up.y = transform.up.y
    listener.up.z = transform.up.z

    // Actualizamos la posición del listener.
    this.#audio.audioContext.listener.forwardX = listener.forward.x
    this.#audio.audioContext.listener.forwardY = listener.forward.y
    this.#audio.audioContext.listener.forwardZ = listener.forward.z
    this.#audio.audioContext.listener.positionX = listener.position.x
    this.#audio.audioContext.listener.positionY = listener.position.y
    this.#audio.audioContext.listener.positionZ = listener.position.z
    this.#audio.audioContext.listener.upX = listener.up.x
    this.#audio.audioContext.listener.upY = listener.up.y
    this.#audio.audioContext.listener.upZ = listener.up.z

    // Actualizamos las posiciones de los emisores.
    for (const emitter of emitters) {
      const transform = Component.findByIdAndConstructor(emitter.id, this.#transform)
      emitter.position.x = transform.position.x
      emitter.position.y = transform.position.y
      emitter.position.z = transform.position.z
    }
  }
}
