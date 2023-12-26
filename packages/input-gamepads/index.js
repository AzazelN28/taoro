import { addEventListeners, removeEventListeners } from '@taoro/events'
import { Runnable } from '@taoro/runnable'

export const INPUT_GAMEPADS_DEFAULT_THRESHOLD = 0.5
export const INPUT_GAMEPADS_DEFAULT_SIGN = 1

/**
 * Gamepad kind
 *
 * @enum {number}
 */
export const GamepadKind = {
  BUTTON: 0,
  AXIS: 1,
}

/**
 *
 */
export class Gamepads {
  #connected = 0
  #gamepads = null
  #onGamepad = (e) => {
    if (e.type === 'gamepadconnected') {
      // TODO: Handle gamepadconnected event.
    } else if (e.type === 'gamepaddisconnected') {
      // TODO: Handle gamepaddisconnected event.
    }
  }

  #runnable = new Runnable()

  /**
   * Indicates whether the gamepad input system is running.
   *
   * @type {boolean}
   */
  get isRunning() {
    return this.#runnable.isRunning
  }

  /**
   * Number of connected gamepads.
   *
   * @type {number}
   */
  get connected() {
    return this.#connected
  }

  /**
   * Returns the state of the specified element of the
   * specified gamepad.
   *
   * @param {number} index
   * @param {InputKind} kind
   * @param {number} subindex
   * @param {number} [sign=INPUT_GAMEPADS_DEFAULT_SIGN]
   * @param {number} [threshold=INPUT_GAMEPADS_DEFAULT_THRESHOLD]
   * @returns {number}
   */
  stateOf(index, kind, subindex, sign = INPUT_GAMEPADS_DEFAULT_SIGN, threshold = INPUT_GAMEPADS_DEFAULT_THRESHOLD) {
    if (!this.#gamepads) {
      return 0.0
    }

    const gamepad = this.#gamepads[index]
    if (!gamepad || !gamepad.connected) {
      return 0.0
    }

    let value = 0
    if (kind === GamepadKind.AXIS) {
      value = gamepad.axes[subindex]
    } else if (kind === GamepadKind.BUTTON) {
      value = gamepad.buttons[subindex].value
    }
    const absValue = Math.abs(value)
    if (Math.sign(value) !== sign || absValue < threshold) {
      return 0.0
    }
    return absValue
  }

  /**
   * Returns true if the specified element of the specified
   * gamepad is pressed.
   *
   * @param {number} index
   * @param {InputKind} kind
   * @param {number} subindex
   * @param {number} [threshold=INPUT_GAMEPADS_DEFAULT_THRESHOLD]
   * @returns {number}
   */
  isPressed(index, kind, subindex, threshold = INPUT_GAMEPADS_DEFAULT_THRESHOLD) {
    return this.stateOf(index, kind, subindex) >= threshold
  }

  /**
   * Returns true if the specified element of the specified
   * gamepad is released.
   *
   * @param {number} index
   * @param {InputKind} kind
   * @param {number} subindex
   * @param {number} [threshold=INPUT_GAMEPADS_DEFAULT_THRESHOLD]
   * @returns {number}
   */
  isReleased(index, kind, subindex, threshold = INPUT_GAMEPADS_DEFAULT_THRESHOLD) {
    return !this.isPressed(index, kind, subindex, threshold)
  }

  /**
   * Updates the state of the gamepads.
   */
  update() {
    this.#gamepads = navigator.getGamepads()
    this.#connected = 0
    for (const gamepad of this.#gamepads) {
      if (gamepad && gamepad.connected) {
        this.#connected++
      }
    }
  }

  /**
   * Starts the gamepad input system.
   *
   * @returns {boolean}
   */
  start() {
    const result = this.#runnable.start()
    if (result) {
      addEventListeners(window, ['gamepadconnected', 'gamepaddisconnected'], this.#onGamepad)
    }
    return result
  }

  /**
   * Stops the gamepad input system.
   *
   * @returns {boolean}
   */
  stop() {
    const result = this.#runnable.stop()
    if (result) {
      removeEventListeners(window, ['gamepadconnected', 'gamepaddisconnected'], this.#onGamepad)
    }
    return result
  }
}

export default Gamepads
