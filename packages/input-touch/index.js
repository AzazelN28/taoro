import { addEventListeners, removeEventListeners } from '@taoro/events'
import { Runnable } from '@taoro/runnable'

export class Touch {
  #target = window

  #axes = new Array(2)
  #buttons = new Map()
  #onTouch = (e) => {
    if (
      e.type === 'touchstart' ||
      e.type === 'touchend' ||
      e.type === 'touchcancel'
    ) {
      this.#buttons.set(e.code, e.type === 'touchstart' ? 1.0 : 0.0)
    }
    this.#axes[0] = e.movementX
    this.#axes[1] = e.movementY
  }

  #runnable = new Runnable()

  get isRunning() {
    return this.#runnable.isRunning
  }

  stateOf(code) {
    return this.#buttons.get(code) ?? 0.0
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
      addEventListeners(
        this.#target,
        ['touchstart', 'touchend', 'touchcancel', 'touchmove'],
        this.#onTouch
      )
    }
    return result
  }

  stop() {
    const result = this.#runnable.stop()
    if (result) {
      removeEventListeners(
        this.#target,
        ['touchstart', 'touchend', 'touchcancel', 'touchmove'],
        this.#onTouch
      )
    }
    return result
  }
}

export default Touch
