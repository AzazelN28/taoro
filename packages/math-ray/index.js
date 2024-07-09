import { Vector3 } from '@taoro/math-vector3';

/**
 * Ray
 */
export class Ray {
  #origin = new Vector3()
  #direction = new Vector3()

  /**
   * Constructor
   *
   * @param {Vector3} origin
   * @param {Vector3} direction
   */
  constructor(origin = new Vector3(), direction = new Vector3()) {
    this.#origin = origin
    this.#direction = direction
  }

  /**
   * @type {Vector3}
   */
  get origin() {
    return this.#origin
  }

  /**
   * @type {Vector3}
   */
  get direction() {
    return this.#direction
  }

  pointAt(x) {
    const origin = Vector3.from(this.#origin)
    const direction = Vector3.from(this.#direction)
    return origin.add(direction.scale(x))
  }
}
