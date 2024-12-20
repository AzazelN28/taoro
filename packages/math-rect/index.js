import Point from '@taoro/math-point'

export class Rect {
  /**
   * Creates a new Rect based on the position and the size
   * of the rectangle.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @returns {Rect}
   */
  static createFromXYWH(x = 0, y = 0, width = 0, height = 0) {
    return new Rect(x, y, width, height)
  }

  /**
   * Creates a new Rect based on the coordinates of the
   * rectangle.
   *
   * @param {number} left
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   * @returns {Rect}
   */
  static createFromLTRB(left = 0, top = 0, right = 0, bottom = 0) {
    return new Rect(left, top, right - left, bottom - top)
  }

  /**
   * Creates a new Rect based on the coordinates of a list
   * of points.
   *
   * @param {Array<PointLike>} points
   * @returns {Rect}
   */
  static createFromPoints(points) {
    let minX = Infinity
    let minY = Infinity
    let maxX = Infinity
    let maxY = Infinity
    for (const { x, y } of points) {
      minX = Math.min(x, minX)
      minY = Math.min(y, minY)
      maxX = Math.max(x, maxX)
      maxY = Math.max(y, maxY)
    }
    return Rect.createFromLTRB(minX, minY, maxX, minY)
  }

  /**
   * Checks if the passed argument is an instance of the Rect class.
   *
   * @param {*} value The value to check
   * @returns {boolean} Returns true if the value is a Rect.
   */
  static isRect(value) {
    return value instanceof Rect
  }

  /**
   * Checks if the passed argument is like a Rect. The condition
   * to check that it is like a Rect is that it should be an object
   * with non-null values and should have properties 'x', 'y', 'width',
   * and 'height' all of which should be numbers.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} Returns true if the value is like a Rect.
   */
  static isRectLike(value) {
    return (
      typeof value === 'object' &&
      value !== null &&
      'x' in value &&
      'y' in value &&
      'width' in value &&
      'height' in value &&
      typeof value.x === 'number' &&
      typeof value.y === 'number' &&
      typeof value.width === 'number' &&
      typeof value.height === 'number'
    )
  }

  #leftTop = new Point()
  #rightBottom = new Point()

  #position = new Point()
  #size = new Point()

  /**
   * Constructor
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor(x = 0, y = 0, width = 0, height = 0) {
    if (typeof x !== 'number') {
      throw new TypeError('Argument x is not a number')
    }
    if (typeof y !== 'number') {
      throw new TypeError('Argument y is not a number')
    }
    if (typeof width !== 'number') {
      throw new TypeError('Argument width is not a number')
    }
    if (typeof height !== 'number') {
      throw new TypeError('Argument height is not a number')
    }
    this.#position.set(x, y)
    this.#size.set(width, height)
  }

  get area() {
    return this.#size.x * this.#size.y
  }

  /**
   * @type {number}
   */
  get length() {
    return this.#size.length
  }

  /**
   * @type {number}
   */
  get aspectRatio() {
    return this.#size.x / this.#size.y
  }

  /**
   * @type {Point}
   */
  get position() {
    return this.#position
  }

  /**
   * @type {Point}
   */
  get size() {
    return this.#size
  }

  /**
   * @type {Point}
   */
  get leftTop() {
    return this.#leftTop
  }

  /**
   * @type {Point}
   */
  get rightBottom() {
    return this.#rightBottom
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

  /**
   * @type {number}
   */
  get width() {
    return this.#size.x
  }

  set width(value) {
    this.#size.x = value
  }

  /**
   * @type {number}
   */
  get height() {
    return this.#size.y
  }

  set height(value) {
    this.#size.y = value
  }

  /**
   * @type {number}
   */
  get halfWidth() {
    return this.#size.x / 2
  }

  set halfWidth(value) {
    this.#size.x = value * 2
  }

  /**
   * @type {number}
   */
  get halfHeight() {
    return this.#size.y / 2
  }

  set halfHeight(value) {
    this.#size.y = value * 2
  }

  /**
   * @type {number}
   */
  get left() {
    return this.#position.x
  }

  set left(value) {
    this.#position.x = value
  }

  /**
   * @type {number}
   */
  get right() {
    return this.#position.x + this.#size.x
  }

  set right(value) {
    this.#position.x = value - this.#size.x
  }

  /**
   * @type {number}
   */
  get top() {
    return this.#position.y
  }

  set top(value) {
    this.#position.y = value
  }

  /**
   * @type {number}
   */
  get bottom() {
    return this.#position.y + this.#size.y
  }

  set bottom(value) {
    this.#position.y = value - this.#size.y
  }

  /**
   * @type {number}
   */
  get centerX() {
    return this.#position.x + this.#size.x / 2
  }

  set centerX(value) {
    this.#position.x = value - this.#size.x / 2
  }

  /**
   * @type {number}
   */
  get centerY() {
    return this.#position.y + this.#size.y / 2
  }

  set centerY(value) {
    this.#position.y = value - this.#size.y / 2
  }

  /**
   * @type {boolean}
   */
  get isDegenerate() {
    return this.width <= 0 || this.height <= 0
  }

  /**
   * @type {boolean}
   */
  get isSquare() {
    return this.width === this.height
  }

  /**
   * @type {boolean}
   */
  get isHorizontal() {
    return this.width > this.height
  }

  /**
   * @type {boolean}
   */
  get isVertical() {
    return this.width < this.height
  }

  setPosition(x, y) {
    this.#position.set(x, y)
    this.#leftTop.set(this.left, this.top)
    this.#rightBottom.set(this.right, this.bottom)
    return this
  }

  setSize(width, height) {
    this.#size.set(width, height)
    this.#rightBottom.set(this.right, this.bottom)
    return this
  }

  set(x, y, width, height) {
    this.#position.set(x, y)
    this.#size.set(width, height)
    this.#leftTop.set(this.left, this.top)
    this.#rightBottom.set(this.right, this.bottom)
    return this
  }

  reset() {
    return this.set(0, 0, 0, 0)
  }

  copy({ x, y, width, height }) {
    return this.set(x, y, width, height)
  }

  clone() {
    return new Rect(this.x, this.y, this.width, this.height)
  }

  translatePoint(point) {
    this.#position.add(point)
    return this
  }

  scalePoint(point) {
    this.#size.multiply(point)
    return this
  }

  /**
   * Checks if the given point (x, y) is within the bounds of this rectangle.
   *
   * @param {number} x The x-coordinate of the point.
   * @param {number} y The y-coordinate of the point.
   * @returns {boolean} Returns true if the point is within the rectangle, otherwise false.
   */
  contains(x, y) {
    return x >= this.left && x < this.right && y >= this.top && y < this.bottom
  }

  /**
   * Checks if the given point is within the bounds of this rectangle.
   *
   * @param {PointLike} point The point
   * @returns {boolean} Returns true if the point is within the rectangle
   */
  containsPoint({ x, y }) {
    return this.contains(x, y)
  }

  /**
   * Checks if the given rectangle is within the bounds of this rectangle.
   *
   * @param {RectLike} rect The rect
   * @returns {boolean} Returns true if the rect is within the rectangle.
   */
  containsRect({ x, y, width, height }) {
    return (
      x >= this.left &&
      x + width < this.right &&
      y >= this.top &&
      y + height < this.bottom
    )
  }

  intersectsRect({ x, y, width, height }) {
    if (x > this.right) return false
    if (x + width < this.left) return false
    if (y > this.bottom) return false
    if (y + height < this.top) return false
    return true
  }

  equalTo({ x, y, width, height }) {
    return (
      this.x === x &&
      this.y === y &&
      this.width === width &&
      this.height === height
    )
  }

  almostEqualTo({ x, y, width, height }, epsilon = 0.000001) {
    return (
      Math.abs(this.x - x) < epsilon &&
      Math.abs(this.y - y) < epsilon &&
      Math.abs(this.width - width) < epsilon &&
      Math.abs(this.height - height) < epsilon
    )
  }

  toFixed(fractionDigits = 0) {
    return `Rect(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(
      fractionDigits
    )}, ${this.width.toFixed(fractionDigits)}, ${this.height.toFixed(
      fractionDigits
    )})`
  }

  toString() {
    return `Rect(${this.x}, ${this.y}, ${this.width}, ${this.height})`
  }

  toArray() {
    return [this.x, this.y, this.width, this.height]
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }
}

export default Rect
