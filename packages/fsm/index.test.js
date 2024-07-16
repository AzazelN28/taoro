import { describe, it, expect } from 'vitest';
import { FiniteStateMachine } from '.';

describe('Finite State Machine', () => {
  it('should create a new Finite State Machine', () => {
    const State = {
      NOT_STARTED: 0,
      STARTED: 1,
      ENDED: 2
    }

    const Transitions = {
      [State.NOT_STARTED]: [State.STARTED],
      [State.STARTED]: [State.ENDED]
    }

    const fsm = new FiniteStateMachine(State.NOT_STARTED, Transitions)
    fsm.currentState = State.STARTED
    expect(fsm.currentState).toBe(State.STARTED)
    fsm.currentState = State.ENDED
    expect(fsm.currentState).toBe(State.ENDED)
    expect(() => (fsm.currentState = State.STARTED)).toThrowError(
      'Invalid state transition from 2 to 1'
    )
  })
})
