export class Vector4 {
  static NUM_ELEMENTS = 4

  static X = 0
  static Y = 1
  static Z = 2
  static W = 3

  /**
   * Creates a new vector
   *
   * @param {Float32Array|Float64Array} [Type=Float32Array]
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   * @param {number} [w=1]
   * @returns {Vector4}
   */
  static create(Type = Float32Array, x = 0, y = 0, z = 0, w = 1) {
    return new Vector4(Type, x, y, z, w)
  }

  /**
   * Creates a new vector from a vector.
   *
   * @param {Vector4} vector
   * @returns {Vector4}
   */
  static from({ x, y, z, w }) {
    return new Vector4(x, y, z, w)
  }

  /**
   * @type {Float32Array|Float64Array}
   */
  #rawData = null;

  /**
   * Constructor
   *
   * @param {Float32Array|Float64Array} [Type=Float32Array]
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   * @param {number} [w=1]
   */
  constructor(Type = Float32Array, x = 0, y = 0, z = 0, w = 1) {
    this.#rawData = new Type([
      x || 0, y || 0, z || 0, w || 1
    ])
  }

  get x() { return this.#rawData[Vector4.X] }
  set x(x) { this.#rawData[Vector4.X] = x }

  get y() { return this.#rawData[Vector4.Y] }
  set y(y) { this.#rawData[Vector4.Y] = y }

  get z() { return this.#rawData[Vector4.Z] }
  set z(z) { this.#rawData[Vector4.Z] = z }

  get w() { return this.#rawData[Vector4.W] }
  set w(w) { this.#rawData[Vector4.W] = w }

  /**
   * Length of this vector.
   *
   * @type {number}
   */
  get length() {
    return Math.hypot(this.x, this.y, this.z)
  }

  /**
   * Squared length of this vector.
   *
   * @type {number}
   */
  get lengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }

  /**
   * Sets the coordinates of this vector.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @returns {Vector4}
   */
  set(x, y, z, w) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
    return this
  }

  /**
   * Resets this vector.
   *
   * @returns {Vector4}
   */
  reset() {
    return this.set(0, 0, 0, 1)
  }

  /**
   * Clamps this vector between two values.
   *
   * @param {Vector4} min
   * @param {Vector4} max
   * @returns {Vector4}
   */
  clamp(min, max) {
    return this.set(
      Math.max(min.x, Math.min(max.x, this.x)),
      Math.max(min.y, Math.min(max.y, this.y)),
      Math.max(min.z, Math.min(max.z, this.z)),
      Math.max(min.w, Math.min(max.w, this.w))
    )
  }

  /**
   * Copies another vector into this vector.
   *
   * @param {Vector4} param0
   * @returns {Vector4}
   */
  copy({ x, y, z, w }) {
    return this.set(x, y, z, w)
  }

  /**
   * Clones this vector.
   *
   * @returns {Vector4}
   */
  clone() {
    return new Vector4(this.x, this.y, this.z, this.w)
  }

  /**
   * Adds another vector into this vector.
   *
   * @param {Vector4} vector
   * @returns {Vector4}
   */
  add({ x, y, z, w }) {
    return this.set(this.x + x, this.y + y, this.z + z, this.w + w)
  }

  /**
   * Subtracts another vector from this vector.
   *
   * @param {Vector4} vector
   * @returns {Vector4}
   */
  subtract({ x, y, z, w }) {
    return this.set(this.x - x, this.y - y, this.z - z, this.w - w)
  }

  /**
   * Multiplies another vector by this vector.
   *
   * @param {Vector4} vector
   * @returns {Vector4}
   */
  multiply({ x, y, z, w }) {
    return this.set(this.x * x, this.y * y, this.z * z, this.w * w)
  }

  /**
   * Divides another vector by this vector.
   *
   * @param {Vector4} vector
   * @returns {Vector4}
   */
  divide({ x, y, z, w }) {
    return this.set(this.x / x, this.y / y, this.z / z, this.w / w)
  }

  /**
   * Scales this vector by a scalar.
   *
   * @param {number} scalar
   * @returns {Vector4}
   */
  scale(scalar) {
    return this.set(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar,
      this.w * scalar
    )
  }

  /**
   * Negates this vector.
   *
   * @returns {Vector4}
   */
  negate() {
    return this.set(-this.x, -this.y, -this.z, -this.w)
  }

  /**
   * Normalizes this vector.
   *
   * @returns {Vector4}
   */
  normalize() {
    const length = this.length
    if (length === 0) return this
    return this.scale(1 / length)
  }

  /**
   * Performs the dot product of this vector by another vector.
   *
   * @param {Vector4} param0
   * @returns {number}
   */
  dot({ x, y, z, w }) {
    return this.x * x + this.y * y + this.z * z + this.w * w
  }

  /**
   * Returns the fixed representation of this vector.
   *
   * @param {number} fractionDigits
   * @returns {string}
   */
  toFixed(fractionDigits) {
    return `Vector4(${this.x.toFixed(fractionDigits)},${this.y.toFixed(fractionDigits)},${this.z.toFixed(fractionDigits)},${this.w.toFixed(fractionDigits)})`
  }

  /**
   * Returns a representation of this vector.
   *
   * @returns {string}
   */
  toString() {
    return `Vector4(${this.x}, ${this.y}, ${this.z}, ${this.w})`
  }
}
