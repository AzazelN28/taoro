export class Vector2 {
  static create(x = 0, y = 0) {
    return new Vector2(x, y)
  }

  static from({ x, y }) {
    return new Vector2(x, y)
  }

  static isFinite({ x, y }) {
    return Number.isFinite(x) && Number.isFinite(y)
  }

  static isInteger({ x, y }) {
    return Number.isInteger(x) && Number.isInteger(y)
  }

  static isZero({ x, y }) {
    return x === 0 && y === 0
  }

  static isVector2(value) {
    return value instanceof Vector2
  }

  static isVector2Like(value) {
    return (
      typeof value === 'object' &&
      value !== null &&
      'x' in value &&
      'y' in value &&
      typeof value.x === 'number' &&
      typeof value.y === 'number'
    )
  }

  /**
   * Constructor
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  /**
   * @type {number}
   */
  get length() {
    return Math.hypot(this.x, this.y)
  }

  /**
   * @type {number}
   */
  get lengthSquared() {
    return this.x * this.x + this.y * this.y
  }

  /**
   * @type {number}
   */
  get angle() {
    return Math.atan2(this.y, this.x)
  }

  /**
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

  clamp(min, max) {
    return this.set(
      Math.max(min.x, Math.min(max.x, this.x)),
      Math.max(min.y, Math.min(max.y, this.y))
    )
  }

  reset() {
    return this.set(0, 0)
  }

  copy({ x, y }) {
    return this.set(x, y)
  }

  clone() {
    return new Vector2(this.x, this.y)
  }

  polar(angle, length = 1) {
    return this.set(Math.cos(angle) * length, Math.sin(angle) * length)
  }

  add({ x, y }) {
    return this.set(this.x + x, this.y + y)
  }

  addScaled({ x, y }, scalar) {
    return this.set(this.x + x * scalar, this.y + y * scalar)
  }

  subtract({ x, y }) {
    return this.set(this.x - x, this.y - y)
  }

  subtractScaled({ x, y }, scalar) {
    return this.set(this.x - x * scalar, this.y - y * scalar)
  }

  multiply({ x, y }) {
    return this.set(this.x * x, this.y * y)
  }

  divide({ x, y }) {
    return this.set(this.x / x, this.y / y)
  }

  scale(scalar) {
    return this.set(this.x * scalar, this.y * scalar)
  }

  rotate(angle) {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return this.set(this.x * cos - this.y * sin, this.x * sin + this.y * cos)
  }

  perpLeft() {
    return this.set(this.y, -this.x)
  }

  perpRight() {
    return this.set(-this.y, this.x)
  }

  normalize() {
    return this.scale(1 / this.length)
  }

  dot({ x, y }) {
    return this.x * x + this.y * y
  }

  cross({ x, y }) {
    return this.x * y - this.y * x
  }

  distanceTo({ x, y }) {
    return Math.hypot(this.x - x, this.y - y)
  }

  angleTo({ x, y }) {
    return Math.atan2(this.y - y, this.x - x)
  }

  round() {
    return this.set(Math.round(this.x), Math.round(this.y))
  }

  floor() {
    return this.set(Math.floor(this.x), Math.floor(this.y))
  }

  ceil() {
    return this.set(Math.ceil(this.x), Math.ceil(this.y))
  }

  greaterThan({ x, y }) {
    return this.x > x && this.y > y
  }

  lessThan({ x, y }) {
    return this.x < x && this.y < y
  }

  greaterOrEqualTo({ x, y }) {
    return this.x >= x && this.y >= y
  }

  lessOrEqualTo({ x, y }) {
    return this.x <= x && this.y <= y
  }

  equalTo({ x, y }) {
    return this.x === x && this.y === y
  }

  almostEqualTo({ x, y }, epsilon = 0.000001) {
    return Math.abs(this.x - x) <= epsilon && Math.abs(this.y - y) <= epsilon
  }

  toFixed(fractionDigits = 0) {
    return `Vector2(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(
      fractionDigits
    )})`
  }

  toString() {
    return `Vector2(${this.x}, ${this.y})`
  }

  toArray() {
    return [this.x, this.y]
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
    }
  }
}

export default Vector2
