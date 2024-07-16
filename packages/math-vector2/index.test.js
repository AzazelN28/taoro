import { describe, it, expect } from 'vitest'
import Vector2 from '.'

describe('Vector2', () => {

  it('should create a new Vector2', () => {
    const vector = new Vector2(25, 25)
    expect(vector.x).toBe(25)
    expect(vector.y).toBe(25)
  })

  it('should create a new Vector2 from another vector', () => {
    const a = new Vector2(3, 14)
    const b = Vector2.from(a)
    expect(b.x).toBe(a.x)
    expect(b.y).toBe(a.y)
  })

  it('should set a vector', () => {
    const a = new Vector2(3, 14)
    a.set(5,35)
    expect(a.x).toBe(5)
    expect(a.y).toBe(35)
  })

  it('should reset a vector', () => {
    const a = new Vector2(3, 14)
    a.reset()
    expect(a.x).toBe(0)
    expect(a.y).toBe(0)
  })

  it('should return the length of the vector', () => {
    const a = new Vector2(3, 14)
    expect(a.length).toBe(Math.hypot(3, 14))
    expect(a.lengthSquared).toBe(3 * 3 + 14 * 14)
  })

})
