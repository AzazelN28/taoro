/**
 * MusicSource
 *
 */
export class MusicSource {
  #audioContext = null
  #buffer = null
  #bufferSourceNode = null
  #gainNode = null

  /**
   * Creates a new MusicSource
   *
   * @param {AudioContext} audioContext
   * @param {AudioBuffer} [buffer=null]
   */
  constructor(audioContext, buffer = null) {
    this.#audioContext = audioContext
    this.#gainNode = audioContext.createGain()
    this.#buffer = buffer
  }

  /**
   * Sets the current buffer.
   */
  set buffer(newBuffer) {
    this.#buffer = newBuffer
  }

  /**
   * Gets the current buffer.
   *
   * @type {AudioBuffer}
   */
  get buffer() {
    return this.#buffer
  }

  /**
   * Returns if the current music source is playing
   *
   * @type {boolean}
   */
  get isPlaying() {
    return this.#bufferSourceNode !== null
  }

  /**
   * Fades in the current music source.
   *
   * @param {number} duration
   * @returns {MusicSource}
   */
  fadeIn(duration = 1) {
    this.#gainNode.gain.setValueAtTime(0, this.#audioContext.currentTime)
    this.#gainNode.gain.linearRampToValueAtTime(
      1,
      this.#audioContext.currentTime + duration
    )
    return this
  }

  /**
   * Fades out the current music source.
   *
   * @param {number} duration
   * @returns {MusicSource}
   */
  fadeOut(duration = 1) {
    this.#gainNode.gain.linearRampToValueAtTime(
      0,
      this.#audioContext.currentTime + duration
    )
    return this
  }

  fadeTo(value, duration = 1) {
    this.#gainNode.gain.linearRampToValueAtTime(
      value,
      this.#audioContext.currentTime + duration
    )
    return this
  }

  set(value) {
    this.#gainNode.gain.setValueAtTime(value, this.#audioContext.currentTime)
    return this
  }

  reset() {
    return this.set(1)
  }

  start() {
    this.#bufferSourceNode = this.#audioContext.createBufferSource()
    this.#bufferSourceNode.buffer = this.#buffer
    this.#bufferSourceNode.loop = true
    this.#bufferSourceNode.connect(this.#gainNode)
    this.#bufferSourceNode.start(this.#audioContext.currentTime)
    return this
  }

  stop(when = 0, callback = null) {
    if (typeof callback === 'function') {
      this.#bufferSourceNode.onended = (e) => callback()
    }
    this.#bufferSourceNode.stop(when)
    this.#bufferSourceNode = null
    return this
  }

  connect(...args) {
    this.#gainNode.connect(...args)
    return this
  }

  disconnect() {
    this.#gainNode.disconnect()
    this.#bufferSourceNode.stop()
    return this
  }
}

export default MusicSource
