export class Vector4 {
  static create(x = 0, y = 0, z = 0, w = 1) {
    return new Vector4(x, y, z, w)
  }

  static from({ x, y, z, w }) {
    return new Vector4(x, y, z, w)
  }

  /**
   * Constructor
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   */
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x ?? 0
    this.y = y ?? 0
    this.z = z ?? 0
    this.w = w ?? 1
  }

  get length() {
    return Math.hypot(this.x, this.y, this.z)
  }

  get lengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }

  set(x, y, z, w) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
    return this
  }

  clamp(min, max) {
    return this.set(
      Math.max(min.x, Math.min(max.x, this.x)),
      Math.max(min.y, Math.min(max.y, this.y)),
      Math.max(min.z, Math.min(max.z, this.z)),
      Math.max(min.w, Math.min(max.w, this.w)),
    )
  }

  reset() {
    return this.set(0, 0, 0, 1)
  }

  copy({ x, y, z, w }) {
    return this.set(x, y, z, w)
  }

  clone() {
    return new Vector4(this.x, this.y, this.z, this.w)
  }

  add({ x, y, z, w }) {
    return this.set(this.x + x, this.y + y, this.z + z, this.w + w)
  }

  subtract({ x, y, z, w }) {
    return this.set(this.x - x, this.y - y, this.z - z, this.w - w)
  }

  multiply({ x, y, z, w }) {
    return this.set(this.x * x, this.y * y, this.z * z, this.w * w)
  }

  divide({ x, y, z, w }) {
    return this.set(this.x / x, this.y / y, this.z / z, this.w / w)
  }

  scale(scalar) {
    return this.set(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar,
      this.w * scalar
    )
  }

  negate() {
    return this.set(-this.x, -this.y, -this.z, -this.w)
  }

  normalize() {
    const length = this.length
    if (length === 0) return this
    return this.scale(1 / length)
  }

  dot({ x, y, z, w }) {
    return this.x * x + this.y * y + this.z * z + this.w * w
  }

  toString() {
    return `Vector4(${this.x}, ${this.y}, ${this.z}, ${this.w})`
  }
}
