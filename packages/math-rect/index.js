import Point from '@taoro/math-point'

export class Rect {
  static create(x = 0, y = 0, width = 0, height = 0) {
    return new Rect(x, y, width, height)
  }

  static createFromBounds(left = 0, top = 0, right = 0, bottom = 0) {
    return new Rect(left, top, right - left, bottom - top)
  }

  static isRect(value) {
    return value instanceof Rect
  }

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

  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.#position.set(x, y)
    this.#size.set(width, height)
  }

  get aspectRatio() {
    return this.#size.x / this.#size.y
  }

  get position() {
    return this.#position
  }

  get size() {
    return this.#size
  }

  get leftTop() {
    return this.#leftTop
  }

  get rightBottom() {
    return this.#rightBottom
  }

  get x() {
    return this.#position.x
  }

  set x(value) {
    this.#position.x = value
  }

  get y() {
    return this.#position.y
  }

  set y(value) {
    this.#position.y = value
  }

  get width() {
    return this.#size.x
  }

  set width(value) {
    this.#size.x = value
  }

  get height() {
    return this.#size.y
  }

  set height(value) {
    this.#size.y = value
  }

  get halfWidth() {
    return this.#size.x / 2
  }

  set halfWidth(value) {
    this.#size.x = value * 2
  }

  get halfHeight() {
    return this.#size.y / 2
  }

  set halfHeight(value) {
    this.#size.y = value * 2
  }

  get left() {
    return this.#position.x
  }

  set left(value) {
    this.#position.x = value
  }

  get right() {
    return this.#position.x + this.#size.x
  }

  set right(value) {
    this.#position.x = value - this.#size.x
  }

  get top() {
    return this.#position.y
  }

  set top(value) {
    this.#position.y = value
  }

  get bottom() {
    return this.#position.y + this.#size.y
  }

  set bottom(value) {
    this.#position.y = value - this.#size.y
  }

  get centerX() {
    return this.#position.x + this.#size.x / 2
  }

  set centerX(value) {
    this.#position.x = value - this.#size.x / 2
  }

  get centerY() {
    return this.#position.y + this.#size.y / 2
  }

  set centerY(value) {
    this.#position.y = value - this.#size.y / 2
  }

  get isDegenerate() {
    return this.width <= 0 || this.height <= 0
  }

  get isSquare() {
    return this.width === this.height
  }

  get isHorizontal() {
    return this.width > this.height
  }

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

  containsPoint({ x, y }) {
    return (
      x >= this.left && x <= this.right && y >= this.top && y <= this.bottom
    )
  }

  containsRect({ x, y, width, height }) {
    return (
      x >= this.left &&
      x + width <= this.right &&
      y >= this.top &&
      y + height <= this.bottom
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
