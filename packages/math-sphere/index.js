import { Vector3 } from '@taoro/math-vector3'

export class Sphere {
  /**
   * Center of the sphere.
   *
   * @type {Vector3}
   */
  #center = new Vector3()

  /**
   * Radius of the sphere.
   *
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

  /**
   * Center of the sphere.
   *
   * @type {Vector3}
   */
  get center() {
    return this.#center
  }

  /**
   * Returns true if the ray intersects the sphere.
   *
   * @param {Ray} ray
   * @returns {boolean}
   */
  isIntersectedBy(ray) {
    const oc = Vector3.subtract(ray.origin, this.center)
    const a = ray.direction.lengthSquared
    const b = 2.0 * Vector3.dot(oc, ray.direction)
    const c = oc.lengthSquared - this.radius * this.radius
    const discriminant = b * b - 4 * a * c
    return (discriminant > 0)
  }
}

export default Sphere
