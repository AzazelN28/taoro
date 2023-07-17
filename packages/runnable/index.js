export class Runnable {
  #isRunning = false

  constructor(isRunning = false) {
    this.#isRunning = isRunning
  }

  get isRunning() {
    return this.#isRunning
  }

  valueOf() {
    return this.#isRunning
  }

  start() {
    if (this.#isRunning) {
      return false
    }
    this.#isRunning = true
    return true
  }

  stop() {
    if (!this.#isRunning) {
      return false
    }
    this.#isRunning = false
    return true
  }
}

export default Runnable
