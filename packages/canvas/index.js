/**
 * Returns true if the given canvas is an instance of
 * HTMLCanvasElement or OffscreenCanvas.
 *
 * @param {*} canvas
 * @returns {boolean}
 */
export function isCanvas(canvas) {
  if (!('OffscreenCanvas' in globalThis)) {
    return canvas instanceof HTMLCanvasElement
  }
  return (
    canvas instanceof HTMLCanvasElement || canvas instanceof OffscreenCanvas
  )
}

/**
 * Creates a canvas element with the given width and height.
 *
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement}
 */
export function createCanvasElement(width, height) {
  if (!Number.isInteger(width) || width <= 0) {
    throw new TypeError('width must be a positive integer')
  }
  if (!Number.isInteger(height) || height <= 0) {
    throw new TypeError('height must be a positive integer')
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

/**
 * Creates an offscreen canvas if supported, otherwise
 * creates a canvas element.
 *
 * @param {number} width
 * @param {number} height
 * @returns {OffscreenCanvas|HTMLCanvasElement}
 */
export function createOffscreenCanvas(width, height) {
  if (!Number.isInteger(width) || width <= 0) {
    throw new TypeError('width must be a positive integer')
  }
  if (!Number.isInteger(height) || height <= 0) {
    throw new TypeError('height must be a positive integer')
  }
  if (!('OffscreenCanvas' in globalThis)) {
    return createCanvasElement(width, height)
  }
  return new OffscreenCanvas(width, height)
}

/**
 * Resizes the canvas to the given width and height.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 * @returns {boolean}
 */
export function resizeTo(canvas, width, height) {
  let resized = false
  if (canvas.width !== width) {
    canvas.width = width
    resized = true
  }
  if (canvas.height !== height) {
    canvas.height = height
    resized = true
  }
  return resized
}

/**
 * Resizes the canvas automatically to its clientWidth and
 * clientHeight using the given multiplier.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} [multiplier=1.0]
 * @returns {boolean}
 */
export function resizeAuto(canvas, multiplier = 1.0) {
  return resizeTo(
    canvas,
    Math.floor(canvas.clientWidth * multiplier),
    Math.floor(canvas.clientHeight * multiplier)
  )
}

export default {
  isCanvas,
  createCanvasElement,
  createOffscreenCanvas,
  resizeTo,
  resizeAuto,
}
