import { describe, it, expect } from 'vitest'
import Vector3 from '.'

describe('Vector3', () => {
  it('should create a new Vector3 using the new operator', () => {
    const a = new Vector3()
    expect(a.x).toBe(0)
    expect(a.y).toBe(0)
    expect(a.z).toBe(0)
  })

  it('should create a new Vector3 with specified values', () => {
    const a = new Vector3(1, 2, 3)
    expect(a.x).toBe(1)
    expect(a.y).toBe(2)
    expect(a.z).toBe(3)
  })

  it('should create a new Vector3 using the static function create', () => {
    const a = Vector3.create()
    expect(a.x).toBe(0)
    expect(a.y).toBe(0)
    expect(a.z).toBe(0)
  })

  it('should create a new Vector3 using the static function create with specified values', () => {
    const a = Vector3.create(1, 2, 3)
    expect(a.x).toBe(1)
    expect(a.y).toBe(2)
    expect(a.z).toBe(3)
  })
})
