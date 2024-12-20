import { Point } from '@taoro/math-point'

export class Circle {
  static create(x = 0, y = 0, radius = 0) {
    return new Circle(x, y, radius)
  }

  /**
   * @type {Point}
   */
  #position = new Point()

  /**
   * Constructor
   *
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   */
  constructor(x = 0, y = 0, radius = 0) {
    if (typeof x !== 'number') throw new TypeError('Argument x is not a number')
    if (typeof y !== 'number') throw new TypeError('Argument y is not a number')
    if (typeof radius !== 'number')
      throw new TypeError('Argument radius is not a number')
    this.#position = new Point(x || 0, y || 0)
    this.radius = radius || 0
  }

  /**
   * @type {Point}
   */
  get position() {
    return this.#position
  }

  /**
   * @type {number}
   */
  get x() {
    return this.#position.x
  }

  set x(value) {
    this.#position.x = value
  }

  /**
   * @type {number}
   */
  get y() {
    return this.#position.y
  }

  set y(value) {
    this.#position.y = value
  }

  pointAt(angle, point = new Point()) {
    return point.reset().polar(angle, this.radius).add(this.#position)
  }

  contains(x, y) {
    return Point.distanceBetween(x, y, this.x, this.y) < this.radius
  }

  containsPoint({ x, y }) {
    return this.contains(x, y)
  }

  containsCircle(x, y, radius) {
    return Point.distanceBetween(x, y, this.x, this.y) < Math.abs(radius - this.radius)
  }

  intersects(x, y, radius) {
    return Point.distanceBetween(x, y, this.x, this.y) < radius + this.radius
  }

  intersectsCircle({ x, y, radius }) {
    return this.intersects(x, y, radius)
  }

  toExponential(fractionDigits = 0) {
    return `Circle(${this.x.toExponential(fractionDigits)}, ${this.y.toExponential(fractionDigits)}, ${this.radius.toExponential(fractionDigits)})`
  }

  toFixed(fractionDigits = 0) {
    return `Circle(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(fractionDigits)}, ${this.radius.toFixed(fractionDigits)})`
  }

  toString() {
    return `Circle(${this.x}, ${this.y}, ${this.radius})`
  }

  toJSON() {
    return { x: this.x, y: this.y, radius: this.radius }
  }
}

export default Circle
