import { describe, it, vi, expect } from 'vitest'
import { createBufferFrom } from './buffer'

describe('WebGL', () => {
  it('should create a new WebGLBuffer when calling createBuffer', () => {
    const gl = {
      ARRAY_BUFFER: 0,
      ELEMENT_ARRAY_BUFFER: 1,

      STATIC_DRAW: 0,

      createBuffer: vi.fn(),
      bufferData: vi.fn(),
      bindBuffer: vi.fn()
    }
    const buffer = createBufferFrom(gl, new Float32Array([1, 0, 0]))
    expect(gl.createBuffer).toBeCalled()
    expect(gl.bufferData).toBeCalledWith(gl.ARRAY_BUFFER, new Float32Array([1,0,0]), gl.STATIC_DRAW)
    expect(gl.bindBuffer).toBeCalledTimes(2)
  })
})
