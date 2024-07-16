import { describe, it, expect } from 'vitest'
import { Matrix2D } from '.'

describe('Matrix2D', () => {
  it('should create a new identity Matrix2D', () => {
    const matrix = new Matrix2D()
    expect(matrix).toBeInstanceOf(Matrix2D)
    expect(matrix.rawData).toStrictEqual([1,0,0,1,0,0])
    expect(matrix.isIdentity).toBe(true)
    expect(matrix.a).toBe(1)
    expect(matrix.b).toBe(0)
    expect(matrix.c).toBe(0)
    expect(matrix.d).toBe(1)
    expect(matrix.e).toBe(0)
    expect(matrix.f).toBe(0)
  })
})
