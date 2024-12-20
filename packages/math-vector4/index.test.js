import { describe, it, expect } from 'vitest';
import { Vector4 } from '.';

describe('Vector4', () => {
  it('should create a Vector4 using the operator new', () => {
    const a = new Vector4()
    expect(a.x).toBe(0)
    expect(a.y).toBe(0)
    expect(a.z).toBe(0)
    expect(a.w).toBe(1)
  })

  it('should create a Vector4 with specified values', () => {
    const a = new Vector4(1, 2, 3, 4)
    expect(a.x).toBe(1)
    expect(a.y).toBe(2)
    expect(a.z).toBe(3)
    expect(a.w).toBe(4)
  })

  it('should create a Vector4 using the static function create', () => {
    const a = Vector4.create()
    expect(a.x).toBe(0)
    expect(a.y).toBe(0)
    expect(a.z).toBe(0)
    expect(a.w).toBe(1)
  })

  it('should create a Vector4 using the static function create with specified values', () => {
    const a = Vector4.create(1, 2, 3, 4)
    expect(a.x).toBe(1)
    expect(a.y).toBe(2)
    expect(a.z).toBe(3)
    expect(a.w).toBe(4)
  })
})
