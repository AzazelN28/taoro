export class Vector2 {
  static NUM_ELEMENTS = 2

  static X = 0
  static Y = 1

  /**
   * Creates a new vector.
   *
   * @param {Function} [Type=Float32Array]
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @returns {Vector2}
   */
  static create(Type = Float32Array, x = 0, y = 0) {
    return new Vector2(Type, x, y)
  }

  /**
   * Creates a new vector from a vector.
   *
   * @param {Vector2} vector
   * @returns {Vector2}
   */
  static from({ x, y }) {
    return new Vector2(x, y)
  }

  /**
   * Returns true if the vector is a finite number.
   *
   * @param {Vector2} vector
   * @returns {boolean}
   */
  static isFinite({ x, y }) {
    return Number.isFinite(x) && Number.isFinite(y)
  }

  /**
   * Returns true if the vector is an integer.
   *
   * @param {Vector2} vector
   * @returns {boolean}
   */
  static isInteger({ x, y }) {
    return Number.isInteger(x) && Number.isInteger(y)
  }

  /**
   * Returns true if the vector is zero.
   *
   * @param {Vector2} vector
   * @returns {boolean}
   */
  static isZero({ x, y }) {
    return x === 0 && y === 0
  }

  /**
   * Returns true if the passed value is an instance
   * of Vector2
   *
   * @param {Vector2} value
   * @returns {boolean}
   */
  static isVector2(value) {
    return value instanceof Vector2
  }

  #rawData = null

  /**
   * Constructor
   *
   * @param {FunctionConstructor} [Type=Float32Array]
   * @param {number} [x=0]
   * @param {number} [y=0]
   */
  constructor(Type = Float32Array, x = 0, y = 0) {
    this.#rawData = new Type([
      x || 0, y || 0
    ])
  }

  /**
   * Length of this vector.
   *
   * @type {number}
   */
  get length() {
    return Math.hypot(this.x, this.y)
  }

  /**
   * Squared length of this vector.
   *
   * @type {number}
   */
  get lengthSquared() {
    return this.x * this.x + this.y * this.y
  }

  /**
   * Angle of this vector.
   *
   * @type {number}
   */
  get angle() {
    return Math.atan2(this.y, this.x)
  }

  /**
   * Sets the values of this vector.
   *
   * @param {number} x
   * @param {number} y
   * @returns {Vector2}
   */
  set(x, y) {
    this.x = x
    this.y = y
    return this
  }

  /**
   * Clamps the components of this vector between min and max.
   *
   * @param {Vector2} min
   * @param {Vector2} max
   * @returns {Vector2}
   */
  clamp(min, max) {
    return this.set(
      Math.max(min.x, Math.min(max.x, this.x)),
      Math.max(min.y, Math.min(max.y, this.y))
    )
  }

  /**
   * Resets the components of this vector.
   *
   * @returns {Vector2}
   */
  reset() {
    return this.set(0, 0)
  }

  /**
   * Copies another vector into this vector.
   *
   * @param {Vector2} vector
   * @returns {Vector2}
   */
  copy({ x, y }) {
    return this.set(x, y)
  }

  /**
   * Clones this vector.
   *
   * @returns {Vector2}
   */
  clone() {
    return new Vector2(this.x, this.y)
  }

  /**
   * Sets the components of this vector from polar coordinates.
   *
   * @param {number} angle
   * @param {number} [length=1]
   * @returns {Vector2}
   */
  polar(angle, length = 1) {
    return this.set(Math.cos(angle) * length, Math.sin(angle) * length)
  }

  /**
   * Adds another vector into this vector.
   *
   * @param {Vector2} vector
   * @returns {Vector2}
   */
  add({ x, y }) {
    return this.set(this.x + x, this.y + y)
  }

  /**
   * Adds a scaled vector into this vector
   *
   * @param {Vector2} vector
   * @param {number} scalar
   * @returns {Vector2}
   */
  addScaled({ x, y }, scalar) {
    return this.set(this.x + x * scalar, this.y + y * scalar)
  }

  /**
   * Subtracts a vector from this vector.
   *
   * @param {Vector2} vector
   * @returns {Vector2}
   */
  subtract({ x, y }) {
    return this.set(this.x - x, this.y - y)
  }

  /**
   * Subtracts a scaled vector from this vector.
   *
   * @param {Vector2} vector
   * @param {number} scalar
   * @returns {Vector2}
   */
  subtractScaled({ x, y }, scalar) {
    return this.set(this.x - x * scalar, this.y - y * scalar)
  }

  multiply({ x, y }) {
    return this.set(this.x * x, this.y * y)
  }

  divide({ x, y }) {
    return this.set(this.x / x, this.y / y)
  }

  /**
   * Scales this vector by a scalar.
   *
   * @param {number} scalar
   * @returns {Vector2}
   */
  scale(scalar) {
    return this.set(this.x * scalar, this.y * scalar)
  }

  /**
   * Rotates this vector by an angle.
   *
   * @param {number} angle
   * @returns {Vector2}
   */
  rotate(angle) {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return this.set(this.x * cos - this.y * sin, this.x * sin + this.y * cos)
  }

  /**
   * Performs a perpendicular rotation to the left of this vector.
   *
   * @returns {Vector2}
   */
  perpLeft() {
    return this.set(this.y, -this.x)
  }

  /**
   * Performs a perpendicular rotation to the right of this vector.
   *
   * @returns {Vector2}
   */
  perpRight() {
    return this.set(-this.y, this.x)
  }

  /**
   * Normalizes this vector.
   *
   * @returns {Vector2}
   */
  normalize() {
    return this.scale(1 / this.length)
  }

  /**
   * Performs the dot product of this vector by another vector.
   *
   * @param {Vector2} vector
   * @returns {number}
   */
  dot({ x, y }) {
    return this.x * x + this.y * y
  }

  /**
   * Performs the cross product of this vector by another vector.
   *
   * A 2D vector doesn't have the concept of cross product but
   * this asumes that are 3D vectors on the same plane.
   *
   * @param {Vector2} vector
   * @returns {number}
   */
  cross({ x, y }) {
    return this.x * y - this.y * x
  }

  /**
   * Returns the distance between this vector and another
   * vector.
   *
   * @param {Vector2} vector
   * @returns {number}
   */
  distanceTo({ x, y }) {
    return Math.hypot(this.x - x, this.y - y)
  }

  /**
   * Returns the angle between this vector and another
   * vector.
   *
   * @param {Vector2} vector
   * @returns {number}
   */
  angleTo({ x, y }) {
    return Math.atan2(this.y - y, this.x - x)
  }

  /**
   * Rounds this vector.
   *
   * @returns {Vector2}
   */
  round() {
    return this.set(Math.round(this.x), Math.round(this.y))
  }

  /**
   * Floors this vector.
   *
   * @returns {Vector2}
   */
  floor() {
    return this.set(Math.floor(this.x), Math.floor(this.y))
  }

  /**
   * Ceils this vector.
   *
   * @returns {Vector2}
   */
  ceil() {
    return this.set(Math.ceil(this.x), Math.ceil(this.y))
  }

  /**
   * Returns true if this vector is greater than another
   * vector.
   *
   * @param {Vector2} vector
   * @returns {boolean}
   */
  greaterThan({ x, y }) {
    return this.x > x && this.y > y
  }

  /**
   * Returns true if this vector is less than another
   * vector.
   *
   * @param {Vector2} vector
   * @returns {boolean}
   */
  lessThan({ x, y }) {
    return this.x < x && this.y < y
  }

  /**
   * Returns true if this vector is greater or equal
   * than another vector.
   *
   * @param {Vector2} vector
   * @returns {boolean}
   */
  greaterOrEqualTo({ x, y }) {
    return this.x >= x && this.y >= y
  }

  /**
   * Returns true if this vector is less or equal
   * than another vector.
   *
   * @param {Vector2} vector
   * @returns {boolean}
   */
  lessOrEqualTo({ x, y }) {
    return this.x <= x && this.y <= y
  }

  /**
   * Returns true if this vector is equal to
   * another vector.
   *
   * @param {Vector2} vector
   * @returns {boolean}
   */
  equalTo({ x, y }) {
    return this.x === x && this.y === y
  }

  /**
   * Returns true if this vector is almost equal
   * to another vector.
   *
   * @param {Vector2} param0
   * @param {number} [epsilon=0.0001]
   * @returns {boolean}
   */
  almostEqualTo({ x, y }, epsilon = 0.0001) {
    return Math.abs(this.x - x) <= epsilon && Math.abs(this.y - y) <= epsilon
  }

  /**
   * Returns the fixed representation of this vector.
   *
   * @param {number} [fractionDigits]
   * @returns {string}
   */
  toFixed(fractionDigits = 0) {
    return `Vector2(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(
      fractionDigits
    )})`
  }

  /**
   * Returns the representation of this vector.
   *
   * @returns {string}
   */
  toString() {
    return `Vector2(${this.x}, ${this.y})`
  }

  /**
   * Returns this vector as an array.
   *
   * @returns {[number, number]}
   */
  toArray() {
    return [this.x, this.y]
  }

  /**
   * Returns this vector as JSON compatible.
   *
   * @returns {Object}
   */
  toJSON() {
    return {
      x: this.x,
      y: this.y,
    }
  }
}

export default Vector2
