import { Component }  from '@taoro/component'
import { Point } from '@taoro/math-point'
import { Matrix } from '@taoro/math-matrix-2d'

/**
 * Options for the transform component.
 *
 * @typedef {Object} TransformComponentOptions
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [rotation=0]
 * @property {number} [scaleX=1]
 * @property {number} [scaleY=1]
 * @property {number} [skewX=0]
 * @property {number} [skewY=0]
 */

/**
 * A 2D transform component.
 */
export class TransformComponent extends Component {
  #position = new Point()
  #scale = new Point(1, 1)
  #skew = new Point()
  #directionNeedsUpdate = true
  #direction = new Point()
  #rotation = 0
  #matrix = new Matrix()

  /**
   * Creates a new transform component.
   *
   * @param {*} id
   * @param {TransformComponentOptions} [options]
   */
  constructor(id, { x = 0, y = 0, rotation = 0, scaleX = 1, scaleY = 1, skewX = 0, skewY = 0 } = {}) {
    super(id)
    this.#position.set(x ?? 0, y ?? 0)
    this.#rotation = rotation ?? 0
    this.#scale.set(scaleX ?? 1, scaleY ?? 1)
    this.#skew.set(skewX ?? 0, skewY ?? 0)
    this.#direction.polar(rotation)
  }

  get rotation() {
    return this.#rotation
  }

  set rotation(value) {
    this.#rotation = value
    this.#directionNeedsUpdate = true
  }

  get direction() {
    if (this.#directionNeedsUpdate) {
      this.#direction.polar(this.#rotation)
      this.#directionNeedsUpdate = false
    }
    return this.#direction
  }

  get position() {
    return this.#position
  }

  get scale() {
    return this.#scale
  }

  get skew() {
    return this.#skew
  }

  get matrix() {
    return this.#matrix
  }

  updateMatrix() {
    this.#matrix.identity()
    this.#matrix.translate(this.#position.x, this.#position.y)
    this.#matrix.rotate(this.#rotation)
    this.#matrix.scale(this.#scale.x, this.#scale.y)
    this.#matrix.skew(this.#skew.x, this.#skew.y)
    return this
  }
}

export default TransformComponent
