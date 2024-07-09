import { Vector3 } from '@taoro/math-vector3'

export class Sphere {
  /**
   * @type {Vector3}
   */
  #center = new Vector3()

  /**
   * @type {number}
   */
  radius = 1

  /**
   * Constructor
   *
   * @param {Vector3} center
   * @param {number} radius
   */
  constructor(center = new Vector3(), radius = 1) {
    this.#center = center
    this.radius = radius
  }

  get center() {
    return this.#center
  }

  isIntersectedBy(ray) {

  }
}

export default Sphere
