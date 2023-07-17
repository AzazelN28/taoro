import { Runnable } from '@taoro/runnable'
import { Loop } from '@taoro/loop'

export class Core {
  #runnable = new Runnable()
  #loop = new Loop()
  #systems = []

  constructor(systems = []) {
    this.#systems = systems
  }

  get isRunning() {
    return this.#runnable.isRunning
  }

  get loop() {
    return this.#loop
  }

  get systems() {
    return this.#systems
  }

  start() {
    const result = this.#runnable.start()
    if (result) {
      this.#systems.forEach((system) => system.start?.())
    }
    this.#loop.start()
    return result
  }

  stop() {
    const result = this.#runnable.stop()
    if (result) {
      this.#systems.forEach((system) => system.stop?.())
    }
    this.#loop.stop()
    return result
  }
}

export default Core
