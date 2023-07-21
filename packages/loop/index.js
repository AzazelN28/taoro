import { Runnable } from '@taoro/runnable'

/**
 * Options for the loop.
 *
 * @typedef {Object} LoopOptions
 * @property {Function} [requestAnimationFrame=window.requestAnimationFrame]
 * @property {Function} [cancelAnimationFrame=window.cancelAnimationFrame]
 */

/**
 * Loop is used to run a pipeline of functions on each frame.
 */
export class Loop {
  /**
   * Validates if the given pipeline is valid. A valid pipeline
   * is an array of functions.
   *
   * @param {*} pipeline
   * @returns {boolean}
   */
  static isPipeline(pipeline) {
    if (!Array.isArray(pipeline)) {
      return false
    }
    if (pipeline.length === 0) {
      return true
    }
    return pipeline.every((step) => typeof step === 'function')
  }

  /**
   * Request animation frame is used to request the next frame.
   *
   * @type {Function}
   */
  #requestAnimationFrame = null

  /**
   * Cancel animation frame is used to cancel the animation frame.
   *
   * @type {Function}
   */
  #cancelAnimationFrame = null

  /**
   * Frame ID is used to cancel the animation frame.
   *
   * @type {number}
   */
  #frameId = null

  /**
   * Current time (provided by rAF).
   *
   * @type {number}
   */
  #currentTime = 0

  /**
   * On frame is called on each frame.
   */
  #onFrame = (currentTime) => {
    this.#currentTime = currentTime ?? 0
    this.#pipeline.forEach((step) => step(currentTime))
    this.#frameId = this.#requestAnimationFrame.call(null, this.#onFrame)
  }

  /**
   * Pipeline is an array of functions that will be called on each frame.
   *
   * @type {Array<Function>}
   */
  #pipeline = []

  /**
   * Runnable is used to start and stop the loop.
   */
  #runnable = new Runnable()

  /**
   * Creates a new loop.
   *
   * @param {Array<Function>} [pipeline]
   * @param {LoopOptions} [options]
   */
  constructor(pipeline = [], {
    requestAnimationFrame = window.requestAnimationFrame,
    cancelAnimationFrame = window.cancelAnimationFrame,
  } = {}) {
    if (pipeline && !Loop.isPipeline(pipeline)) {
      throw new Error('Invalid pipeline')
    }
    this.#requestAnimationFrame = requestAnimationFrame
    this.#cancelAnimationFrame = cancelAnimationFrame
    this.#pipeline = pipeline ?? []
  }

  /**
   * Pipeline is an array of functions that will be called on each frame.
   *
   * @type {Array<Function>}
   */
  get pipeline() {
    return this.#pipeline
  }

  /**
   * Is running is true if the loop is running.
   *
   * @type {boolean}
   */
  get isRunning() {
    return this.#runnable.isRunning
  }

  /**
   * Current time (provided by rAF)
   *
   * @type {number}
   */
  get currentTime() {
    return this.#currentTime
  }

  /**
   * Starts the loop.
   *
   * @returns {boolean}
   */
  start() {
    const result = this.#runnable.start()
    if (result) {
      this.#frameId = this.#requestAnimationFrame.call(null, this.#onFrame)
    }
    return result
  }

  /**
   * Stops the loop.
   *
   * @returns {boolean}
   */
  stop() {
    const result = this.#runnable.stop()
    if (result) {
      this.#cancelAnimationFrame.call(null, this.#frameId)
      this.#frameId = null
    }
    return result
  }
}

export default Loop
