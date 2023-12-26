/**
 * Finite State Machine
 */
export class FiniteStateMachine {
  #currentState = null
  #initialState = null
  #transitions = null

  /**
   * Creates a new finite state machine.
   *
   * @param {string} initialState
   * @param {Map<string, Array<string>>} transitions
   */
  constructor(initialState, transitions = new Map()) {
    this.#initialState = initialState
    this.#currentState = initialState
    this.#transitions = transitions
  }

  /**
   * The initial state.
   *
   * @readonly
   * @type {string}
   */
  get initialState() {
    return this.#initialState
  }

  /**
   * The current state.
   *
   * @readonly
   * @type {string}
   */
  get currentState() {
    return this.#currentState
  }

  /**
   * Sets the current state.
   *
   * @param {string} newState
   * @throws {Error} Throws an error if the state transition is invalid.
   */
  set currentState(newState) {
    if (!this.transitionTo(newState)) {
      throw new Error(`Invalid state transition from ${this.#currentState} to ${newState}`)
    }
  }

  /**
   * Transitions to a new state. Returns `true` if the state machine can transition to the new state, `false` otherwise.
   *
   * @param {string} newState
   * @returns {boolean}
   */
  transitionTo(newState) {
    if (!this.#transitions.has(this.#currentState)) {
      return false
    }
    const availableTransitions = this.#transitions.get(this.#currentState)
    if (!availableTransitions.includes(newState)) {
      return false
    }
    this.#currentState = newState
    return true
  }

  /**
   * Returns the current state.
   *
   * @returns {string}
   */
  valueOf() {
    return this.#currentState
  }

  /**
   * Returns the current state.
   *
   * @returns {string}
   */
  toString() {
    return this.#currentState
  }

  /**
   * Returns the current state.
   *
   * @returns {string}
   */
  toJSON() {
    return this.#currentState
  }

  /**
   * Returns the current state.
   *
   * @returns {string}
   */
  [Symbol.toPrimitive]() {
    return this.#currentState
  }
}
