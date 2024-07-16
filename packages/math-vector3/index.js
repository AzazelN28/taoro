import vec3 from './vec3'

export class Vector3 {
  static NUM_ELEMENTS = 3

  static X = 0
  static Y = 1
  static Z = 2

  static transform(out, a, matrix) {
    return vec3.transformMat4(out.rawData, a.rawData, matrix.rawData)
  }

  /**
   * Creates a new Vector3
   *
   * @param {FunctionConstructor} [Type=Float32Array]
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Vector3}
   */
  static create(Type = Float32Array, x = 0, y = 0, z = 0) {
    return new Vector3(Type, x, y, z)
  }

  /**
   * Creates a new Vector3 from another Vector3
   *
   * @param {Vector3} vector
   * @returns {Vector3}
   */
  static from({ x, y, z })  {
    return new Vector3(x, y, z)
  }

  /**
   * Returns true if all the Vector3 properties are finite.
   *
   * @param {Vector3} param0
   * @returns {boolean}
   */
  static isFinite({ x, y, z }) {
    return Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)
  }

  /**
   * Returns true if all the Vector3 properties are integers.
   *
   * @param {Vector3} param0
   * @returns {boolean}
   */
  static isInteger({ x, y, z }) {
    return Number.isInteger(x) && Number.isInteger(y) && Number.isFinite(z)
  }

  /**
   * Returns true if all the Vector3 properties are zero.
   *
   * @param {Vector3} param0
   * @returns {boolean}
   */
  static isZero({ x, y, z }) {
    return x === 0 && y === 0 && z === 0
  }

  /**
   * Returns the result of adding b to a
   *
   * @param {Vector3} a
   * @param {Vector3} b
   * @param {Vector3} [o]
   * @returns {Vector3}
   */
  static add(a, b, o = new Vector3) {
    return o.copy(a).add(b)
  }

  /**
   * Returns the result of a minus b
   *
   * @param {Vector3} a
   * @param {Vector3} b
   * @param {Vector3} [o]
   * @returns {Vector3}
   */
  static subtract(a, b, o = new Vector3) {
    return o.copy(a).subtract(b)
  }

  /**
   * Returns the multiplication of a and b
   *
   * @param {Vector3} a
   * @param {Vector3} b
   * @param {Vector3} [o]
   * @returns {Vector3}
   */
  static multiply(a, b, o = new Vector3) {
    return o.copy(a).multiply(b)
  }

  /**
   * Returns the division of a and b
   *
   * @param {Vector3} a
   * @param {Vector3} b
   * @param {Vector3} [o]
   * @returns {Vector3}
   */
  static divide(a, b, o = new Vector3) {
    return o.copy(a).divide(b)
  }

  /**
   * Returns the dot product of two vectors.
   *
   * @param {Vector3} a
   * @param {Vector3} b
   * @returns {number}
   */
  static dot({ x: ax, y: ay, z: az }, { x: bx, y: by, z: bz }) {
    return ax * bx + ay * by + az * bz
  }

  /**
   * Returns the cross product of two vectors
   *
   * @param {Vector3} a
   * @param {Vector3} b
   * @param {Vector3} [o]
   * @returns {Vector3}
   */
  static cross(a, b, o = new Vector3) {
    return o.copy(a).cross(b)
  }

  /**
   * @type {Float32Array|Float64Array}
   */
  #rawData = null;

  /**
   * Constructor
   *
   * @param {Float32Array|Float64Array} Type
   * @param {number} [x]
   * @param {number} [y]
   * @param {number} [z]
   */
  constructor(Type = Float32Array, x = 0, y = 0, z = 0) {
    this.#rawData = new Type([
      x, y, z
    ])
  }

  get rawData() { return this.#rawData }

  get x() { return this.#rawData[Vector3.X] }
  set x(x) { this.#rawData[Vector3.X] = x }

  get y() { return this.#rawData[Vector3.Y] }
  set y(y) { this.#rawData[Vector3.Y] = y }

  get z() { return this.#rawData[Vector3.Z] }
  set z(z) { this.#rawData[Vector3.Z] = z }

  /**
   * Length of the vector.
   *
   * @type {number}
   */
  get length() {
    return Math.hypot(this.x, this.y, this.z)
  }

  /**
   * Length squared of the vector.
   *
   * @type {number}
   */
  get lengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }

  /**
   * Sets all the vector coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Vector3}
   */
  set(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  /**
   * Clamps this vector between a min and a max.
   *
   * @param {Vector3} min
   * @param {Vector3} max
   * @returns {Vector3}
   */
  clamp(min, max) {
    return this.set(
      Math.max(min.x, Math.min(max.x, this.x)),
      Math.max(min.y, Math.min(max.y, this.y)),
      Math.max(min.z, Math.min(max.z, this.z)),
    )
  }

  /**
   * Resets the value of this vector to zero.
   *
   * @returns {Vector3}
   */
  reset() {
    return this.set(0, 0, 0)
  }

  /**
   * Copies another vector into this vector.
   *
   * @param {Vector3} vector
   * @returns {Vector3}
   */
  copy({ x, y, z }) {
    return this.set(x, y, z)
  }

  /**
   * Clones this vector.
   *
   * @returns {Vector3}
   */
  clone() {
    return new Vector3(this.x, this.y, this.z)
  }

  /**
   * Adds a vector into this vector.
   *
   * @param {Vector3} vector
   * @returns {Vector3}
   */
  add({ x, y, z }) {
    return this.set(this.x + x, this.y + y, this.z + z)
  }

  /**
   * Subtracts a vector from this vector.
   *
   * @param {Vector3} param0
   * @returns {Vector3}
   */
  subtract({ x, y, z }) {
    return this.set(this.x - x, this.y - y, this.z - z)
  }

  /**
   * Multiplies this vector by another vector.
   *
   * @param {Vector3} vector
   * @returns {Vector3}
   */
  multiply({ x, y, z }) {
    return this.set(this.x * x, this.y * y, this.z * z)
  }

  /**
   * Divides this vector by another vector.
   *
   * @param {Vector3} vector
   * @returns {Vector3}
   */
  divide({ x, y, z }) {
    return this.set(this.x / x, this.y / y, this.z / z)
  }

  /**
   * Scales this vector by a scalar.
   *
   * @param {Vector3} scalar
   * @returns {Vector3}
   */
  scale(scalar) {
    return this.set(this.x * scalar, this.y * scalar, this.z * scalar)
  }

  /**
   * Negates this vector.
   *
   * @returns {Vector3}
   */
  negate() {
    return this.set(-this.x, -this.y, -this.z)
  }

  /**
   * Normalizes this vector.
   *
   * @returns {Vector3}
   */
  normalize() {
    const length = this.length
    if (length === 0) return this
    return this.scale(1 / length)
  }

  /**
   * Performs the dot product of this vector by another vector.
   *
   * @param {Vector3} vector
   * @returns {number}
   */
  dot({ x, y, z }) {
    return this.x * x + this.y * y + this.z * z
  }

  /**
   * Performs the cross product of this vector by another vector.
   *
   * @param {Vector3} param0
   * @returns {Vector3}
   */
  cross({ x, y, z }) {
    return this.set(
      this.y * z - this.z * y,
      this.z * x - this.x * z,
      this.x * y - this.y * x
    )
  }

  /**
   * Returns the fixed representation of this vector.
   *
   * @param {number} [fractionDigits]
   * @returns {string}
   */
  toFixed(fractionDigits) {
    return `Vector3(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(fractionDigits)}, ${this.z.toFixed(fractionDigits)})`
  }

  /**
   * Returns the representation of this vector.
   *
   * @returns {string}
   */
  toString() {
    return `Vector3(${this.x}, ${this.y}, ${this.z})`
  }
}

export default Vector3
