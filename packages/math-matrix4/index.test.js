import { describe, it, expect } from 'vitest';
import { Matrix4 } from '.'

describe('Matrix4', () => {
  it('should create a new Matrix4 (by default Float32Array)', () => {
    const matrix = new Matrix4()
    expect(matrix.rawData).toBeInstanceOf(Float32Array)
    expect(matrix.rawData).toHaveLength(Matrix4.NUM_ELEMENTS)
  })

  it('should create a new Matrix4 (Float64Array)', () => {
    const matrix = new Matrix4()
    expect(matrix.rawData).toBeInstanceOf(Float64Array)
    expect(matrix.rawData).toHaveLength(Matrix4.NUM_ELEMENTS)
  })
})
