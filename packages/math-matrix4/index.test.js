import { describe, it, expect } from 'vitest';
import mat4 from 'gl-mat4'
import { Matrix4 } from '.'

describe('Matrix4', () => {
  it('should create a new Matrix4 (by default Float32Array)', () => {
    const matrix = new Matrix4()
    expect(matrix.rawData).toBeInstanceOf(Float32Array)
    expect(matrix.rawData).toHaveLength(Matrix4.NUM_ELEMENTS)
    expect(matrix.isIdentity).toBe(true)
  })

  it('should create a new Matrix4 (Float64Array)', () => {
    const matrix = new Matrix4(new Float64Array(Matrix4.NUM_ELEMENTS))
    expect(matrix.rawData).toBeInstanceOf(Float64Array)
    expect(matrix.rawData).toHaveLength(Matrix4.NUM_ELEMENTS)
    expect(matrix.isIdentity).toBe(true)
  })

  it('should create a new perspective matrix', () => {
    const fieldOfView = Math.PI * 0.5
    const aspectRatio = 16 / 9
    const near = 1
    const far = 1000
    const rawData = mat4.create()
    mat4.perspective(rawData, fieldOfView, aspectRatio, near, far)
    const matrix = new Matrix4()
    matrix.perspective(fieldOfView, aspectRatio, near, far)
    expect(matrix.rawData).toStrictEqual(rawData)
  })
})
