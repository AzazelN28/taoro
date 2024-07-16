import { Vector3 } from '@taoro/math-vector3'

export class Plane {
  /**
   * Normal of the plane
   *
   * @type {Vector3}
   */
  #normal = new Vector3()

  /**
   * Constant value of the plane.
   *
   * @type {number}
   */
  constant = 0

  /**
   * Constructor
   *
   * @param {Vector3} normal
   * @param {number} constant
   */
  constructor(normal = new Vector3(), constant = 0) {
    this.#normal = normal
    this.constant = constant
  }

  /**
   * Normal of the plane.
   *
   * @type {Vector3}
   */
  get normal() {
    return this.#normal
  }

  /**
   * Sets the normal and the constant of the plane.
   *
   * @param {Vector3} normal
   * @param {number} constant
   * @returns {Plane}
   */
  set(normal, constant) {
    this.#normal.copy(normal)
    this.constant = constant
    return this
  }

  /**
   * Copies a plane into this plane.
   *
   * @param {Plane} plane
   * @returns {Plane}
   */
  copy({ normal, constant }) {
    return this.set(normal, constant)
  }

  /**
   * Clones this plane.
   *
   * @returns {Plane}
   */
  clone() {
    return new Plane(this.#normal, this.constant)
  }
}
