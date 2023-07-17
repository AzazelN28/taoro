import { addEventListeners, removeEventListeners } from '@taoro/events'
import { Runnable } from '@taoro/runnable'

export const INPUT_GAMEPADS_DEFAULT_THRESHOLD = 0.5

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

  get isRunning() {
    return this.#runnable.isRunning
  }

  get connected() {
    return this.#connected
  }

  stateOf(index, kind, subindex, sign = 1, threshold = INPUT_GAMEPADS_DEFAULT_THRESHOLD) {
    if (!this.#gamepads) {
      return 0.0
    }

    const gamepad = this.#gamepads[index]
    if (!gamepad || !gamepad.connected) {
      return 0.0
    }

    let value = 0
    if (kind === 1) {
      value = gamepad.axes[subindex]
    } else if (kind === 0) {
      value = gamepad.buttons[subindex].value
    }
    const absValue = Math.abs(value)
    if (Math.sign(value) !== sign || absValue < threshold) {
      return 0.0
    }
    return absValue
  }

  isPressed(index, kind, subindex, threshold = INPUT_GAMEPADS_DEFAULT_THRESHOLD) {
    return this.stateOf(index, kind, subindex) >= threshold
  }

  isReleased(index, kind, subindex, threshold = INPUT_GAMEPADS_DEFAULT_THRESHOLD) {
    return !this.isPressed(index, kind, subindex, threshold)
  }

  update() {
    this.#gamepads = navigator.getGamepads()
    this.#connected = 0
    for (const gamepad of this.#gamepads) {
      if (gamepad && gamepad.connected) {
        this.#connected++
      }
    }
  }

  start() {
    const result = this.#runnable.start()
    if (result) {
      addEventListeners(window, ['gamepadconnected', 'gamepaddisconnected'], this.#onGamepad)
    }
    return result
  }

  stop() {
    const result = this.#runnable.stop()
    if (result) {
      removeEventListeners(window, ['gamepadconnected', 'gamepaddisconnected'], this.#onGamepad)
    }
    return result
  }
}

export default Gamepads
