import { AudioChannelName } from '@taoro/audio-channel'

/**
 * Sound play options
 *
 * @typedef {Object} SoundPlayOptions
 * @property {Function} [onEnded=null]
 * @property {number} [when=0]
 * @property {number} [offset=0]
 * @property {number} [duration=0]
 * @property {number} [playbackRate=1]
 */

/**
 * Sound Subsystem
 */
export class Sound {
  #audio = null
  #channelName = null

  /**
   * Creates a new Sound Subsystem.
   *
   * @param {Audio} audio Audio System
   * @param {string} [channelName=AudioChannelName.SFX]
   */
  constructor(audio, channelName = AudioChannelName.SFX) {
    this.#audio = audio
    this.#channelName = channelName
  }

  /**
   * Plays a new sound.
   *
   * @param {AudioBuffer} buffer AudioBuffer to play
   * @param {SoundPlayOptions} [options=] Options
   */
  play(buffer, options) {
    if (!buffer) {
      throw new Error('AudioBuffer not specified')
    }
    const bufferSourceNode = this.#audio.audioContext.createBufferSource()
    bufferSourceNode.buffer = buffer
    if (Number.isFinite(options?.playbackRate)) {
      bufferSourceNode.playbackRate.value = options?.playbackRate ?? 1
    }
    if (Number.isFinite(options?.detune)) {
      bufferSourceNode.detune.value = options?.detune ?? 0
    }
    bufferSourceNode.connect(this.#audio.get(this.#channelName).destination)
    bufferSourceNode.start(
      options?.when,
      options?.offset,
      options?.duration
    )
    if (typeof options?.onEnded === 'function') {
      bufferSourceNode.onended = () => options?.onEnded()
    }
  }
}

export default Sound
