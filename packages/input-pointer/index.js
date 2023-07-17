import { addEventListeners, removeEventListeners } from '@taoro/events'
import { Runnable } from '@taoro/runnable'

export class Pointer {
  static getButtonName(button) {
    switch (button) {
      case 0:
        return 'LeftButton'
      case 1:
        return 'MiddleButton'
      case 2:
        return 'RightButton'
      default:
        return `Button${button}`
    }
  }

  #target = window

  #axes = new Array(2)
  #buttons = new Map()
  #onPointer = (e) => {
    if (e.type === 'pointerdown' || e.type === 'pointerup') {
      this.#buttons.set(
        Pointer.getButtonName(e.button),
        e.type === 'pointerdown' ? 1.0 : 0.0
      )
    }
    this.#axes[0] = e.movementX
    this.#axes[1] = e.movementY
  }

  #runnable = new Runnable()

  get isRunning() {
    return this.#runnable.isRunning
  }

  stateOf(kind, subindex) {
    if (kind === 1) {
      return this.#axes[subindex] ?? 0.0
    } else if (kind === 0) {
      return this.#buttons.get(subindex) ?? 0.0
    }
  }

  isPressed(kind, subindex) {
    return this.stateOf(kind, subindex) > 0.0
  }

  isReleased(kind, subindex) {
    return !this.isPressed(kind, subindex)
  }

  start() {
    const result = this.#runnable.start()
    if (result) {
      addEventListeners(
        this.#target,
        ['pointerdown', 'pointerup', 'pointermove'],
        this.#onPointer
      )
    }
    return result
  }

  stop() {
    const result = this.#runnable.stop()
    if (result) {
      removeEventListeners(
        this.#target,
        ['pointerdown', 'pointerup', 'pointermove'],
        this.#onPointer
      )
    }
    return result
  }
}

export default Pointer
