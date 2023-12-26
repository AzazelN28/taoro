import { Component } from '@taoro/component'
import { TransformComponent as TransformComponent2D } from '@taoro/component-transform-2d'
import { TransformComponent as TransformComponent3D } from '@taoro/component-transform-3d'
import { Vector3 } from '@taoro/math-vector3'
import { AudioChannelName } from '@taoro/audio-channel'

export const AudioEmitterState = {
  STOPPED: 'stopped',
  STARTED: 'started',
}

export const AudioEmitterDistanceModel = {
  LINEAR: 'linear',
  INVERSE: 'inverse',
  EXPONENTIAL: 'exponential',
}

export const AudioEmitterPanningModel = {
  HRTF: 'HRTF',
  EQUALPOWER: 'equalpower',
}

export class AudioListenerComponent extends Component {
  constructor(id) {
    super(id)
    this.position = new Vector3(0, 0, 0)
    this.forward = new Vector3(1, 0, 0)
    this.up = new Vector3(0, 1, 0)
  }
}

/**
 * Audio Emitter Component
 */
export class AudioEmitterComponent extends Component {
  constructor(id, { buffer, loop, loopStart, loopEnd, playbackRate, refDistance, maxDistance, rolloffFactor, coneInnerAngle, coneOuterAngle, coneOuterGain, state }) {
    super(id)
    this.buffer = buffer
    this.distanceModel = AudioEmitterDistanceModel.LINEAR
    this.panningModel = AudioEmitterPanningModel.EQUALPOWER
    this.refDistance = refDistance ?? 1
    this.maxDistance = maxDistance ?? 4
    this.rolloffFactor = rolloffFactor ?? 1
    this.coneInnerAngle = coneInnerAngle ?? 360
    this.coneOuterAngle = coneOuterAngle ?? 0
    this.coneOuterGain = coneOuterGain ?? 0
    this.loop = loop ?? true
    this.loopStart = loopStart ?? 0
    this.loopEnd = loopEnd ?? 0
    this.playbackRate = playbackRate ?? 1
    this.state = state ?? AudioEmitterState.STOPPED
  }
}

/**
 * Object that contains the audio nodes for every emitter.
 *
 * @typedef {object} AudioEmitterNodes
 * @property {AudioBufferSourceNode} bufferSourceNode
 * @property {PannerNode} pannerNode
 */

/**
 * Audio 3D System
 */
export class Audio3D {
  /**
   * Audio System
   *
   * @type {Audio}
   */
  #audio = null

  /**
   * Name of the channel that we're going to use
   *
   * @default AudioChannelName.SFX
   * @type {string}
   */
  #channelName = AudioChannelName.SFX

  /**
   * Transform component that we're going to use as
   * the positional source for the spatial audio.
   *
   * @type {TransformComponent2D|TransformComponent3D}
   */
  #transform = null

  /**
   * Keeps audio nodes for every emitter.
   *
   * @type {Map<*, AudioEmitterNodes>}
   */
  #nodes = new Map()

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
    const listeners = Component.findByConstructor(AudioListenerComponent)
    if (!listeners) {
      return
    }

    const emitters = Component.findByConstructor(AudioEmitterComponent)
    if (!emitters) {
      return
    }

    // There can be only one listener per AudioContext so we take the first one.
    // Maybe in local multiplayer games we can have more than one listener instantiating
    // more AudioContexts, one per canvas or one per player.
    const [listener] = listeners
    const transform = Component.findByIdAndConstructor(listener.id, this.#transform)
    if (transform instanceof TransformComponent2D) {
      listener.forward.x = transform.direction.x
      listener.forward.z = transform.direction.y
      // listener.forward.z = transform.forward.z
      listener.position.x = transform.position.x
      listener.position.z = transform.position.y
      // listener.position.z = transform.position.z
      listener.up.x = 0
      listener.up.y = 1
      listener.up.z = 0
    } else if (transform instanceof TransformComponent3D) {
      listener.forward.x = transform.forward.x
      listener.forward.y = transform.forward.y
      listener.forward.z = transform.forward.z
      listener.position.x = transform.position.x
      listener.position.y = transform.position.y
      listener.position.z = transform.position.z
      listener.up.x = transform.up.x
      listener.up.y = transform.up.y
      listener.up.z = transform.up.z
    }

    // Update listeners position.
    this.#audio.audioContext.listener.forwardX.value = listener.forward.x
    this.#audio.audioContext.listener.forwardY.value = listener.forward.y
    this.#audio.audioContext.listener.forwardZ.value = listener.forward.z
    this.#audio.audioContext.listener.positionX.value = listener.position.x
    this.#audio.audioContext.listener.positionY.value = listener.position.y
    this.#audio.audioContext.listener.positionZ.value = listener.position.z
    this.#audio.audioContext.listener.upX.value = listener.up.x
    this.#audio.audioContext.listener.upY.value = listener.up.y
    this.#audio.audioContext.listener.upZ.value = listener.up.z

    // Update emitter positions and
    // parameters.
    for (const emitter of emitters) {
      if (emitter.buffer === null || emitter.state !== AudioEmitterState.STARTED) {
        continue
      }

      if (!this.#nodes.has(emitter.id)) {
        this.#nodes.set(emitter.id, {
          bufferSourceNode: null,
          pannerNode: null,
        })
      }

      const nodes = this.#nodes.get(emitter.id)
      // If the pannerNode is null, we create it and connect it to the
      // destination node of this system.
      if (nodes.pannerNode === null) {
        nodes.pannerNode = this.#audio.audioContext.createPanner()

        nodes.pannerNode.distanceModel = emitter.distanceModel
        nodes.pannerNode.panningModel = emitter.panningModel
        nodes.pannerNode.refDistance = emitter.refDistance
        nodes.pannerNode.maxDistance = emitter.maxDistance

        nodes.pannerNode.coneInnerAngle = emitter.coneInnerAngle
        nodes.pannerNode.coneOuterAngle = emitter.coneOuterAngle
        nodes.pannerNode.coneOuterGain = emitter.coneOuterGain
      }

      // If the bufferSourceNode is null, we create it and start
      // playing the sound immediately.
      if (nodes.bufferSourceNode === null) {
        nodes.bufferSourceNode = this.#audio.audioContext.createBufferSource()

        nodes.bufferSourceNode.buffer = emitter.buffer
        nodes.bufferSourceNode.loop = emitter.loop
        nodes.bufferSourceNode.loopStart = emitter.loopStart
        nodes.bufferSourceNode.loopEnd = emitter.loopEnd
        nodes.bufferSourceNode.playbackRate.value = emitter.playbackRate
        nodes.bufferSourceNode.connect(nodes.pannerNode)
        nodes.bufferSourceNode.start()
        nodes.bufferSourceNode.onended = () => {
          emitter.state = AudioEmitterState.STOPPED
          nodes.bufferSourceNode = null
        }

        nodes.pannerNode.connect(this.#audio.get(this.#channelName).destination)
      }

      // For every emitter we update the position and orientation
      // of the pannerNode.
      const transform = Component.findByIdAndConstructor(emitter.id, this.#transform)
      if (transform instanceof TransformComponent2D) {
        nodes.pannerNode.positionX.value = transform.position.x
        nodes.pannerNode.positionZ.value = transform.position.y

        nodes.pannerNode.orientationX.value = transform.direction.x
        nodes.pannerNode.orientationZ.value = transform.direction.y
      } else if (transform instanceof TransformComponent3D) {
        nodes.pannerNode.positionX = transform.position.x
        nodes.pannerNode.positionY = transform.position.y
        nodes.pannerNode.positionZ = transform.position.z
      }
    }
  }
}
