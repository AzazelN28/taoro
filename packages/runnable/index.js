/**
 * A runnable is an object that can be started and stopped.
 */
export class Runnable {
  #isRunning = false

  /**
   * Constructor
   *
   * @param {boolean} [isRunning=false] Indicates the initial state of the runnable
   */
  constructor(isRunning = false) {
    this.#isRunning = isRunning
  }

  /**
   * `true` if the runnable is running or `false` otherwise.
   *
   * @readonly
   * @type {boolean}
   */
  get isRunning() {
    return this.#isRunning
  }

  /**
   * Returns `true` if the runnable is running or `false` otherwise.
   *
   * @returns {boolean}
   */
  valueOf() {
    return this.#isRunning
  }

  /**
   * Starts the runnable.
   *
   * @returns {boolean} Returns `true` if the runnable was started or `false` if it was already running.
   */
  start() {
    if (this.#isRunning) {
      return false
    }
    this.#isRunning = true
    return true
  }

  /**
   * Stops the runnable.
   *
   * @returns {boolean} Returns `true` if the runnable was stopped or `false` if it was already stopped.
   */
  stop() {
    if (!this.#isRunning) {
      return false
    }
    this.#isRunning = false
    return true
  }
}

export default Runnable
