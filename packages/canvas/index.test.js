import { describe, test, expect } from 'vitest'
import { createCanvasElement, createOffscreenCanvas, isCanvas, resizeTo, resizeBy } from '.'

/* @vitest-environment jsdom */
describe('Canvas', () => {
  window.OffscreenCanvas = class OffscreenCanvas {
    constructor(width, height) {}
  }

  test('isCanvas', () => {
    expect(isCanvas(document.createElement('canvas'))).toBe(true)
    expect(isCanvas(new OffscreenCanvas(1, 1))).toBe(true)
    expect(isCanvas(document.createElement('div'))).toBeFalsy()
    expect(isCanvas(null)).toBeFalsy()
  })

  test('createOffscreenCanvas', () => {
    expect(createOffscreenCanvas(1, 1)).toBeInstanceOf(OffscreenCanvas)
  })

  test('createCanvasElement', () => {
    expect(createCanvasElement(1, 1)).toBeInstanceOf(HTMLCanvasElement)
  })

  test('resizeTo', () => {
    const canvas = document.createElement('canvas')
    expect(resizeTo(canvas, 320, 200)).toBe(true)
  })

  test('resizeBy', () => {
    const canvas = document.createElement('canvas')
    expect(resizeBy(canvas, 1.0)).toBe(true)
  })
})
