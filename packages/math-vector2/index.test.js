import { describe, test, expect } from 'vitest'
import Vector2 from '.'

describe('Vector2', () => {
  test('create a new Vector2', () => {
    const vector = new Vector2(25, 25)
    expect(vector.x).toBe(25)
    expect(vector.y).toBe(25)
  })
})
