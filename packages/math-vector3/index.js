export class Vector3 {
  static create(x = 0, y = 0, z = 0) {
    return new Vector3(x, y, z)
  }

  static from({ x, y, z })  {
    return new Vector3(x, y, z)
  }

  static isFinite({ x, y, z }) {
    return Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)
  }

  static isInteger({ x, y, z }) {
    return Number.isInteger(x) && Number.isInteger(y) && Number.isFinite(z)
  }

  static isZero({ x, y }) {
    return x === 0 && y === 0
  }

  constructor(x = 0, y = 0, z = 0) {
    this.x = x ?? 0
    this.y = y ?? 0
    this.z = z ?? 0
  }

  get length() {
    return Math.hypot(this.x, this.y, this.z)
  }

  get lengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }

  set(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    return this
  }

  clamp(min, max) {
    return this.set(
      Math.max(min.x, Math.min(max.x, this.x)),
      Math.max(min.y, Math.min(max.y, this.y)),
      Math.max(min.z, Math.min(max.z, this.z)),
    )
  }

  reset() {
    return this.set(0, 0, 0)
  }

  copy({ x, y, z }) {
    return this.set(x, y, z)
  }

  clone() {
    return new Vector3(this.x, this.y, this.z)
  }

  add({ x, y, z }) {
    return this.set(this.x + x, this.y + y, this.z + z)
  }

  subtract({ x, y, z }) {
    return this.set(this.x - x, this.y - y, this.z - z)
  }

  multiply({ x, y, z }) {
    return this.set(this.x * x, this.y * y, this.z * z)
  }

  divide({ x, y, z }) {
    return this.set(this.x / x, this.y / y, this.z / z)
  }

  scale(scalar) {
    return this.set(this.x * scalar, this.y * scalar, this.z * scalar)
  }

  negate() {
    return this.set(-this.x, -this.y, -this.z)
  }

  normalize() {
    const length = this.length
    if (length === 0) return this
    return this.scale(1 / length)
  }

  dot({ x, y, z }) {
    return this.x * x + this.y * y + this.z * z
  }

  cross({ x, y, z }) {
    return this.set(
      this.y * z - this.z * y,
      this.z * x - this.x * z,
      this.x * y - this.y * x
    )
  }

  toString() {
    return `Vector3(${this.x}, ${this.y}, ${this.z})`
  }
}
