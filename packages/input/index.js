import { Keyboard } from '@taoro/input-keyboard'
import { Mouse } from '@taoro/input-mouse'
import { Pointer } from '@taoro/input-pointer'
import { Touch } from '@taoro/input-touch'
import { Gamepads } from '@taoro/input-gamepads'
import { Runnable } from '@taoro/runnable'

/**
 * Maximum number of input states.
 *
 * @type {number}
 */
export const INPUT_MAX_STATES = 4

/**
 * Device type
 *
 * @enum {number}
 */
export const InputDevice = {
  KEYBOARD: 0,
  MOUSE: 1,
  POINTER: 2,
  TOUCH: 3,
  GAMEPAD: 4,
}

/**
 * Input kind
 *
 * @enum {number}
 */
export const InputKind = {
  BUTTON: 0,
  AXIS: 1,
}

/**
 * Input state.
 */
export class InputState {
  #index = 0
  #state = new Map()
  #bindings = new Map()

  constructor(index) {
    this.#index = index
    this.#bindings = new Map()
    this.#state = new Map()
  }

  get state() {
    return this.#state
  }

  get index() {
    return this.#index
  }

  /**
   * Returns the state of the specified action.
   *
   * @param {string} name
   * @returns {number}
   */
  stateOf(name) {
    return this.#state.get(name) ?? 0.0
  }

  /**
   * Updates all input states.
   *
   * @param {Array<InputDevice>} devices
   * @returns {boolean}
   */
  update(devices) {
    if (!devices || !this.#bindings) {
      return false
    }
    for (const [name, bindings] of this.#bindings) {
      let value = 0.0
      for (const [deviceIndex, deviceBindings] of bindings) {
        value = Math.max(value, devices[deviceIndex]?.stateOf?.(...deviceBindings) ?? 0.0)
      }
      this.#state.set(name, value)
    }
    return true
  }

  setBindings(template, ...args) {
    this.#bindings = new Map(template(this, ...args))
    return this
  }
}

/**
 * Input is used to manage input devices.
 */
export class Input {
  #keyboard = new Keyboard()
  #mouse = new Mouse()
  #pointer = new Pointer()
  #touch = new Touch()
  #gamepads = new Gamepads()

  #devices = []
  #states = null

  #runnable = new Runnable()

  get isRunning() {
    return this.#runnable.isRunning
  }

  get keyboard() {
    return this.#keyboard
  }

  get mouse() {
    return this.#mouse
  }

  get pointer() {
    return this.#pointer
  }

  get touch() {
    return this.#touch
  }

  get gamepads() {
    return this.#gamepads
  }

  /**
   * Input states.
   */
  constructor() {
    this.#devices = [
      this.#keyboard,
      this.#mouse,
      this.#pointer,
      this.#touch,
      this.#gamepads,
    ]
    this.#states = Array.from(
      new Array(INPUT_MAX_STATES),
      (_, index) => new InputState(index)
    )
  }

  /**
   * Returns the input state assigned to the specified index.
   *
   * @param {number} [index=0]
   * @param {Function} template
   * @param {...any} args
   * @returns {Input}
   */
  setBindings(index, template, ...args) {
    this.#states[index].setBindings(template, ...args)
    return this
  }

  /**
   * Returns the state of the input devices assigned to the specified index.
   *
   * @param {number} [index=0]
   * @param {string} action
   * @returns {Map<string, any>}
   */
  stateOf(index, action) {
    return this.#states[index]?.stateOf?.(action) ?? 0.0
  }

  /**
   * Updates the input states.
   */
  #updateStates() {
    for (const state of this.#states) {
      state.update(this.#devices)
    }
  }

  /**
   * Updates the input devices.
   */
  update() {
    this.#devices.forEach((device) => device.update?.())
    this.#updateStates()
  }

  /**
   * Starts the input devices.
   *
   * @returns {boolean}
   */
  start() {
    const result = this.#runnable.start()
    if (result) {
      this.#devices.forEach((device) => device.start?.())
    }
    return result
  }

  /**
   * Stops the input devices.
   *
   * @returns {boolean}
   */
  stop() {
    const result = this.#runnable.stop()
    if (result) {
      this.#devices.forEach((device) => device.stop?.())
    }
    return result
  }
}

export default Input
