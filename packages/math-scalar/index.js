export const EPSILON = 0.00001

export class Scalar {
  static isBetween(value, min, max) {
    return value >= min && value <= max
  }

  static areEqual(a, b) {
    return a === b
  }

  static greaterThan(a, b) {
    return a > b
  }

  static lessThan(a, b) {
    return a < b
  }

  static greaterOrEqualTo(a, b) {
    return a >= b
  }

  static lessOrEqualTo(a, b) {
    return a <= b
  }

  static areAlmostEqual(a, b, epsilon = EPISLON) {
    return Math.abs(a - b) < epsilon
  }

  static add(a, b) {
    return a + b
  }

  static subtract(a, b) {
    return a - b
  }

  static multiply(a, b) {
    return a * b
  }

  static divide(a, b) {
    return a / b
  }

  constructor(initialValue = 0) {
    this.value = initialValue
  }

  get isInteger() {
    return Number.isInteger(this.value)
  }

  get isFinite() {
    return Number.isFinite(this.value)
  }

  get isNaN() {
    return Number.isNaN(this.value)
  }

  get isPositive() {
    return this.value > 0
  }

  get isNegative() {
    return this.value < 0
  }

  get() {
    return this.value
  }

  set(newValue) {
    this.value = newValue
    return this
  }

  equalTo(value) {
    return this.value === value
  }

  greaterThan(value) {
    return this.value > value
  }

  lessThan(value) {
    return this.value < value
  }

  greaterOrEqualTo(value) {
    return this.value >= value
  }

  lessOrEqualTo(value) {
    return this.value <= value
  }

  almostEqualTo(value, epsilon = EPISLON) {
    return Math.abs(this.value - value) < epsilon
  }

  isBetween(min, max) {
    return this.value >= min && this.value <= max
  }

  add(value) {
    return this.set(this.value + value)
  }

  subtract(value) {
    return this.set(this.value - value)
  }

  multiply(value) {
    return this.set(this.value * value)
  }

  divide(value) {
    return this.set(this.value / value)
  }

  clamp(min, max) {
    return this.set(Math.min(Math.max(this.value, min), max))
  }

  valueOf() {
    return this.value
  }

  toFixed(fractionDigits = 0) {
    return this.value.toFixed(fractionDigits)
  }

  toString() {
    return this.value.toString()
  }

  toJSON() {
    return this.value
  }

  [Symbol.toPrimitive](hint) {
    return hint === 'number' ? this.value : this.value.toString()
  }
}

export default Scalar
