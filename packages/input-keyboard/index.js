import { addEventListeners, removeEventListeners } from '@taoro/events'
import { Runnable } from '@taoro/runnable'

export class Keyboard {
  /**
   * Target that will handle key events.
   *
   * @type {HTMLElement}
   */
  #target = window

  /**
   * State of the keys.
   *
   * @type {Map<string, number>}
   */
  #keys = new Map()

  /**
   * Keyboard listener
   *
   * @param {KeyboardEvent} e
   */
  #onKey = (e) => {
    this.#keys.set(e.code, e.type === 'keydown' ? 1.0 : 0.0)
  }

  /**
   * Runnable that handles the running state of this system.
   *
   * @type {Runnable}
   */
  #runnable = new Runnable()

  /**
   * @type {boolean}
   */
  get isRunning() {
    return this.#runnable.isRunning
  }

  /**
   * Returns the state of a key code.
   *
   * 0.0 = released
   * 1.0 = pressed
   *
   * @param {string} code
   * @returns {number}
   */
  stateOf(code) {
    return this.#keys.get(code) ?? 0.0
  }

  /**
   * Returns true if a key code is pressed.
   *
   * @example
   * keyboard.isPressed('KeyW')
   * @param {string} code
   * @returns {boolean}
   */
  isPressed(code) {
    return this.stateOf(code) > 0.0
  }

  /**
   * Returns true if a key code is not pressed.
   *
   * @example
   * keyboard.isReleased('KeyW')
   * @param {string} code
   * @returns {boolean}
   */
  isReleased(code) {
    return !this.isPressed(code)
  }

  /**
   * Starts the keyboard system.
   *
   * @returns {}
   */
  start() {
    const result = this.#runnable.start()
    if (result) {
      addEventListeners(this.#target, ['keydown', 'keyup'], this.#onKey)
    }
    return result
  }

  /**
   * Stops the keyboard system.
   *
   * @returns {}
   */
  stop() {
    const result = this.#runnable.stop()
    if (result) {
      removeEventListeners(this.#target, ['keydown', 'keyup'], this.#onKey)
    }
    return result
  }
}

export default Keyboard
