export class FiniteStateMachine {
  #currentState = null
  #initialState = null
  #transitions = null

  constructor(initialState, transitions = new Map()) {
    this.#initialState = initialState
    this.#currentState = initialState
    this.#transitions = transitions
  }

  get initialState() {
    return this.#initialState
  }

  get currentState() {
    return this.#currentState
  }

  set currentState(newState) {
    if (!this.transitionTo(newState)) {
      throw new Error(`Invalid state transition from ${this.#currentState} to ${newState}`)
    }
  }

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

  valueOf() {
    return this.#currentState
  }

  [Symbol.toPrimitive]() {
    return this.#currentState
  }
}
