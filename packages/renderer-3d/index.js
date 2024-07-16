import Matrix4 from '@taoro/math-matrix4'

export class CameraComponent {
  /**
   * @type {Matrix4}
   */
  #projectionMatrix = new Matrix4()

  /**
   * Constructor
   */
  constructor(options) {

  }
}

/**
 * Renderer
 */
export class Renderer {
  /**
   * Rendering canvas.
   *
   * @type {HTMLCanvasElement|OffscreenCanvas}
   */
  #canvas = null

  /**
   * Rendering context
   *
   * @type {WebGLRenderingContext|WebGL2RenderingContext}
   */
  #context = null

  /**
   * Constructor
   *
   * @param {HTMLCanvasElement|OffscreenCanvas} canvas
   * @param {RendererOptions} options
   */
  constructor(canvas, options) {
    this.#canvas = canvas
    this.#context = canvas.getContext(
      options?.contextId ?? 'webgl2',
      options?.contextAttributes
    )
  }

  get canvas() {
    return this.#canvas
  }

  get context() {
    return this.#context
  }

  update() {

  }
}

export default Renderer
