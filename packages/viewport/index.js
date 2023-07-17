import { Runnable } from '@taoro/runnable'
import { addEventListeners, removeEventListeners } from '@taoro/events'
import { Rect } from '@taoro/math-rect'
import { resizeAuto, resizeTo } from '@taoro/canvas'

/**
 * The ViewportFullscreen class is responsible
 * for managing fullscreen mode.
 */
class ViewportFullscreen {
  /**
   * @type {HTMLCanvasElement}
   */
  #canvas = null

  /**
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
 * We define a static method to check if a value is a valid ViewportResizeMode.
 * This is a non-enumerable property, so it won't show up in Object.keys()
 * or Object.values()
 *
 * @nonenumerable
 * @function isResizeMode
 * @param {ViewportResizeMode} value
 * @returns {boolean}
 */
Object.defineProperty(ViewportResizeMode, 'isResizeMode', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function (value) {
    return Object.values(ViewportResizeMode).includes(value)
  },
})

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
  #canvas = null
  #mode = ViewportResizeMode.AUTO
  #width = 320
  #height = 200
  #scale = 1.0
  #rect = new Rect()
  #fullscreen = null
  #runnable = new Runnable()

  /**
   * Instantiates a new viewport.
   *
   * @param {HTMLCanvasElement} canvas
   * @param {ViewportOptions} options
   */
  constructor(
    canvas,
    {
      mode = ViewportResizeMode.AUTO,
      scale = 1.0,
      width = 320,
      height = 200,
    } = {}
  ) {
    this.#canvas = canvas
    if (!ViewportResizeMode.isResizeMode(mode)) {
      throw new Error(`Viewport: Invalid resize mode "${mode}"`)
    }
    this.#mode = mode ?? ViewportResizeMode.AUTO
    this.#width = width ?? 320
    this.#height = height ?? 200
    this.#scale = scale ?? 1.0
    this.#rect = new Rect()
    this.#fullscreen = new ViewportFullscreen(canvas)
  }

  get isRunning() {
    return this.#runnable.isRunning
  }

  set mode(value) {
    if (!ViewportResizeMode.isResizeMode(value)) {
      throw new Error('Viewport: Invalid resize mode')
    }
    this.#mode = value
  }

  get mode() {
    return this.#mode
  }

  set scale(value) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Viewport: Invalid resize scale')
    }
    this.#scale = value
  }

  get scale() {
    return this.#scale
  }

  get currentWidth() {
    return this.#canvas.width
  }

  get currentHeight() {
    return this.#canvas.height
  }

  get currentHalfWidth() {
    return this.#canvas.width / 2
  }

  get currentHalfHeight() {
    return this.#canvas.height / 2
  }

  set width(value) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Viewport: Invalid resize width')
    }
    this.#width = Math.floor(value)
  }

  get width() {
    return this.#width
  }

  set height(value) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Viewport: Invalid resize height')
    }
    this.#height = Math.floor(value)
  }

  get height() {
    return this.#height
  }

  get rect() {
    return this.#rect
  }

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

  update() {
    let resized = false
    if (this.#mode === ViewportResizeMode.AUTO) {
      resized = resizeAuto(this.#canvas, this.#scale)
    } else if (this.#mode === ViewportResizeMode.NONE) {
      resized = resizeTo(this.#canvas, this.#width, this.#height)
    } else {
      throw new Error('Viewport: Invalid resize mode')
    }

    if (resized) {
      this.#rect.size.set(this.#canvas.width, this.#canvas.height)
    }
  }

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
