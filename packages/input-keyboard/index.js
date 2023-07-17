import { addEventListeners, removeEventListeners } from '@taoro/events'
import { Runnable } from '@taoro/runnable'

export class Keyboard {
  #target = window

  #keys = new Map()
  #onKey = (e) => {
    this.#keys.set(e.code, e.type === 'keydown' ? 1.0 : 0.0)
  }

  #runnable = new Runnable()

  get isRunning() {
    return this.#runnable.isRunning
  }

  stateOf(code) {
    return this.#keys.get(code) ?? 0.0
  }

  isPressed(code) {
    return this.stateOf(code) > 0.0
  }

  isReleased(code) {
    return !this.isPressed(code)
  }

  start() {
    const result = this.#runnable.start()
    if (result) {
      addEventListeners(this.#target, ['keydown', 'keyup'], this.#onKey)
    }
    return result
  }

  stop() {
    const result = this.#runnable.stop()
    if (result) {
      removeEventListeners(this.#target, ['keydown', 'keyup'], this.#onKey)
    }
    return result
  }
}

export default Keyboard
