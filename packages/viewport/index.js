import { Runnable } from '@taoro/runnable'
import { addEventListeners, removeEventListeners } from '@taoro/events'
import { Rect } from '@taoro/math-rect'
import { resizeBy, resizeTo } from '@taoro/canvas'

/**
 * The ViewportFullscreen class is responsible
 * for managing fullscreen mode.
 */
class ViewportFullscreen {
  /**
   * Canvas element used to manage viewport.
   *
   * @type {HTMLCanvasElement}
   */
  #canvas = null

  /**
   * Constructor
   *
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#canvas = canvas
  }

  /**
   * Returns true if the browser supports fullscreen mode.
   *
   * @type {boolean}
   */
  get isSupported() {
    return document.fullscreenEnabled
  }

  /**
   * Returns true if the canvas is in fullscreen mode.
   *
   * @type {boolean}
   */
  get isFullscreen() {
    return document.fullscreenElement === this.#canvas
  }

  /**
   * Requests fullscreen mode for the canvas.
   *
   * @param {*} [options]
   * @returns {Promise}
   */
  request(options) {
    return this.#canvas.requestFullscreen(options)
  }

  /**
   * Exits fullscreen mode.
   *
   * @returns {Promise}
   */
  exit() {
    return document.exitFullscreen()
  }
}

/**
 * Enumerates the different resize modes.
 *
 * @enum {number}
 */
export const ViewportResizeMode = {
  NONE: 0,
  AUTO: 1,
}

/**
 * Returns true if the value is a valid ViewportResizeMode.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isResizeMode(value) {
  return Object.values(ViewportResizeMode).includes(value)
}

/**
 * Options for the Viewport constructor.
 *
 * @typedef {Object} ViewportOptions
 * @property {HTMLCanvasElement} canvas
 * @property {ViewportResizeMode} [mode=ViewportResizeMode.AUTO]
 * @property {number} [scale=1.0]
 * @property {number} [width=320]
 * @property {number} [height=200]
 */

/**
 * The Viewport class is responsible for managing the size of the canvas
 * and how it is resized when dimensions of the container element changes.
 */
export class Viewport {
  /**
   * @type {HTMLCanvasElement}
   */
  #canvas = null

  /**
   *
   */
  #mode = ViewportResizeMode.AUTO

  /**
   * @type {number}
   */
  #width = 320

  /**
   * @type {number}
   */
  #height = 200

  /**
   * @type {number}
   */
  #scale = 1.0

  /**
   * @type {Rect}
   */
  #rect = new Rect()

  /**
   * @type {ViewportFullscreen}
   */
  #fullscreen = null

  /**
   * @type {Runnable}
   */
  #runnable = new Runnable()

  /**
   * Instantiates a new viewport.
   *
   * @param {HTMLCanvasElement} canvas
   * @param {ViewportOptions} options
   */
  constructor(canvas, options) {
    this.#canvas = canvas
    const mode = options?.mode ?? ViewportResizeMode.AUTO
    if (!isResizeMode(mode)) {
      throw new Error(`Invalid resize mode "${mode}"`)
    }
    this.#mode = mode
    this.#width = options?.width ?? 320
    this.#height = options?.height ?? 200
    this.#scale = options?.scale ?? 1.0
    this.#rect = new Rect()
    this.#fullscreen = new ViewportFullscreen(canvas)
  }

  /**
   * Indicates if the viewport is running.
   *
   * @type {boolean}
   */
  get isRunning() {
    return this.#runnable.isRunning
  }

  /**
   * @type {ViewportResizeMode}
   */
  set mode(mode) {
    if (!isResizeMode(mode)) {
      throw new Error('Invalid resize mode')
    }
    this.#mode = mode
  }

  get mode() {
    return this.#mode
  }

  /**
   * @type {number}
   */
  set scale(value) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Invalid resize scale')
    }
    this.#scale = value
  }

  get scale() {
    return this.#scale
  }

  /**
   * @type {number}
   */
  get currentWidth() {
    return this.#canvas.width
  }

  /**
   * @type {number}
   */
  get currentHeight() {
    return this.#canvas.height
  }

  /**
   * @type {number}
   */
  get currentHalfWidth() {
    return this.#canvas.width / 2
  }

  /**
   * @type {number}
   */
  get currentHalfHeight() {
    return this.#canvas.height / 2
  }

  /**
   * @type {number}
   */
  set width(value) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Invalid resize width')
    }
    this.#width = Math.floor(value)
  }

  get width() {
    return this.#width
  }

  /**
   * @type {number}
   */
  set height(value) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Invalid resize height')
    }
    this.#height = Math.floor(value)
  }

  get height() {
    return this.#height
  }

  /**
   * @type {number}
   */
  get aspectRatio() {
    return this.#width / this.#height
  }

  /**
   * @type {boolean}
   */
  get isSquare() {
    return this.#width === this.#height
  }

  /**
   * @type {boolean}
   */
  get isHorizontal() {
    return this.#width > this.#height
  }

  /**
   * @type {boolean}
   */
  get isVertical() {
    return this.#width < this.#height
  }

  /**
   * @type {Rect}
   */
  get rect() {
    return this.#rect
  }

  /**
   * @type {ViewportFullscreen}
   */
  get fullscreen() {
    return this.#fullscreen
  }

  #onVisibilityChange = (e) => {
    // NOTE: I'm not sure if it makes sense to listen events that are not
    // related to the canvas element. Maybe we should only listen to events
    if (e.type === 'visibilitychange') {
    }
  }

  #onFullscreenChange = (e) => {
    // NOTE: I'm not sure if it makes sense to listen events that are not
    // related to the canvas element. Maybe we should only listen to events
    if (e.type === 'fullscreenchange') {
    } else if (e.type === 'fullscreenerror') {
    }
  }

  /**
   * Sets the viewport options.
   *
   * @param {ViewportOptions} options
   * @returns {Viewport}
   */
  set(options) {
    if (options?.mode) {
      this.mode = options.mode
    }
    if (options?.scale) {
      this.scale = options.scale
    }
    if (options?.width) {
      this.width = options.width
    }
    if (options?.height) {
      this.height = options.height
    }
    return this
  }

  /**
   * Updates the viewport.
   */
  update() {
    let resized = false
    if (this.#mode === ViewportResizeMode.AUTO) {
      resized = resizeBy(this.#canvas, this.#scale)
    } else if (this.#mode === ViewportResizeMode.NONE) {
      resized = resizeTo(this.#canvas, this.#width, this.#height)
    } else {
      throw new Error('Invalid resize mode')
    }

    if (resized) {
      this.#rect.size.set(this.#canvas.width, this.#canvas.height)
    }
  }

  /**
   * Starts the viewport.
   *
   * @returns {boolean}
   */
  start() {
    const result = this.#runnable.start()
    if (result) {
      addEventListeners(
        document,
        ['visibilitychange'],
        this.#onVisibilityChange
      )
      addEventListeners(
        document,
        ['fullscreenchange', 'fullscreenerror'],
        this.#onFullscreenChange
      )
    }
    return result
  }

  /**
   * Stops the viewport.
   *
   * @returns {boolean}
   */
  stop() {
    const result = this.#runnable.stop()
    if (result) {
      removeEventListeners(
        document,
        ['fullscreenchange', 'fullscreenerror'],
        this.#onFullscreenChange
      )
      removeEventListeners(
        document,
        ['visibilitychange'],
        this.#onVisibilityChange
      )
    }
    return result
  }
}

export default Viewport
