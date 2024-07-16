/**
 * Finite State Machine
 */
export class FiniteStateMachine {
  /**
   * Current state
   *
   * @type {string|number}
   */
  #currentState = null

  /**
   * Initial state
   *
   * @type {string|number}
   */
  #initialState = null

  /**
   * Allowed transitions
   *
   * @type {Object.<string|number, Array.<string|number>>}
   */
  #transitions = null

  /**
   * Creates a new finite state machine.
   *
   * @param {string|number} initialState
   * @param {Object.<string|number, Array.<string|number>>} transitions
   */
  constructor(initialState, transitions = new Object()) {
    this.#initialState = initialState
    this.#currentState = initialState
    this.#transitions = transitions
  }

  /**
   * The initial state.
   *
   * @readonly
   * @type {string|number}
   */
  get initialState() {
    return this.#initialState
  }

  /**
   * The current state.
   *
   * @readonly
   * @type {string|number}
   */
  get currentState() {
    return this.#currentState
  }

  /**
   * Sets the current state.
   *
   * @param {string|number} newState
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
   * @param {string|number} newState
   * @returns {boolean}
   */
  transitionTo(newState) {
    if (!(this.#currentState in this.#transitions)) {
      return false
    }
    const availableTransitions = this.#transitions[this.#currentState]
    if (!availableTransitions.includes(newState)) {
      return false
    }
    this.#currentState = newState
    return true
  }

  /**
   * Returns the current state.
   *
   * @returns {string|number}
   */
  valueOf() {
    return this.#currentState
  }

  /**
   * Returns the current state.
   *
   * @returns {string|number}
   */
  toString() {
    return this.#currentState
  }

  /**
   * Returns the current state.
   *
   * @returns {string|number}
   */
  toJSON() {
    return this.#currentState
  }

  /**
   * Returns the current state.
   *
   * @returns {string|number}
   */
  [Symbol.toPrimitive]() {
    return this.#currentState
  }
}
