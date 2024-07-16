import { Vector3 } from '@taoro/math-vector3'

/**
 * Ray
 */
export class Ray {
  /**
   * Origin of the ray.
   *
   * @type {Vector3}
   */
  #origin = new Vector3()

  /**
   * Direction of the ray.
   *
   * @type {Vector3}
   */
  #direction = new Vector3()

  /**
   * Constructor
   *
   * @param {Vector3} origin
   * @param {Vector3} direction
   */
  constructor(origin = new Vector3(0, 0, 0), direction = new Vector3(0, 0, 1)) {
    this.#origin = origin
    this.#direction = direction
  }

  /**
   * Origin of the ray.
   *
   * @type {Vector3}
   */
  get origin() {
    return this.#origin
  }

  /**
   * Direction of the ray.
   *
   * @type {Vector3}
   */
  get direction() {
    return this.#direction
  }

  /**
   * Returns the interpolated coordinates of the point at
   * the specified x.
   *
   * @param {number} x
   * @returns {Vector3}
   */
  pointAt(x) {
    const origin = Vector3.from(this.#origin)
    const direction = Vector3.from(this.#direction)
    return origin.add(direction.scale(x))
  }
}

export default Ray
