export class Matrix2D {
  static ELEMENTS = 6

  #rawData = [1, 0, 0, 1, 0, 0]

  constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
    this.#rawData = [a, b, c, d, e, f]
  }

  get rawData() {
    return this.#rawData
  }

  get isIdentity() {
    return this.a === 1
        && this.b === 0
        && this.c === 0
        && this.d === 1
        && this.e === 0
        && this.f === 0
  }

  get a() {
    return this.#rawData[0]
  }

  set a(value) {
    this.#rawData[0] = value
  }

  get b() {
    return this.#rawData[1]
  }

  set b(value) {
    this.#rawData[1] = value
  }

  get c() {
    return this.#rawData[2]
  }

  set c(value) {
    this.#rawData[2] = value
  }

  get d() {
    return this.#rawData[3]
  }

  set d(value) {
    this.#rawData[3] = value
  }

  get e() {
    return this.#rawData[4]
  }

  set e(value) {
    this.#rawData[4] = value
  }

  get f() {
    return this.#rawData[5]
  }

  set f(value) {
    this.#rawData[5] = value
  }

  set(a, b, c, d, e, f) {
    this.#rawData[0] = a
    this.#rawData[1] = b
    this.#rawData[2] = c
    this.#rawData[3] = d
    this.#rawData[4] = e
    this.#rawData[5] = f
    return this
  }

  reset() {
    return this.set(1, 0, 0, 1, 0, 0)
  }

  identity() {
    return this.reset()
  }

  copy({ a, b, c, d, e, f }) {
    return this.set(a, b, c, d, e, f)
  }

  clone() {
    return new Matrix(...this.#rawData)
  }

  append(a, b, c, d, e, f) {
    return this.set(
      this.a * a + this.c * b,
      this.b * a + this.d * b,
      this.a * c + this.c * d,
      this.b * c + this.d * d,
      this.a * e + this.c * f + this.e,
      this.b * e + this.d * f + this.f
    )
  }

  appendMatrix({ a, b, c, d, e, f }) {
    return this.append(a, b, c, d, e, f)
  }

  prepend(a, b, c, d, e, f) {
    return this.set(
      a * this.a + c * this.b,
      b * this.a + d * this.b,
      a * this.c + c * this.d,
      b * this.c + d * this.d,
      a * this.e + c * this.f + e,
      b * this.e + d * this.f + f
    )
  }

  prependMatrix({ a, b, c, d, e, f }) {
    return this.append(a, b, c, d, e, f)
  }

  translate(x, y) {
    return this.set(this.a, this.b, this.c, this.d, this.e + x, this.f + y)
  }

  translatePoint({ x, y }) {
    return this.translate(x, y)
  }

  rotate(angle) {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return this.set(
      this.a * cos + this.c * sin,
      this.b * cos + this.d * sin,
      this.c * cos - this.a * sin,
      this.d * cos - this.b * sin,
      this.e,
      this.f
    )
  }

  scale(x, y) {
    return this.set(
      this.a * x,
      this.b * x,
      this.c * y,
      this.d * y,
      this.e,
      this.f
    )
  }

  scalePoint({ x, y }) {
    return this.scale(x, y)
  }

  skew(x, y) {
    return this.append(
      Math.cos(y), Math.sin(y),
      -Math.sin(x), Math.cos(x),
      0, 0
    )
  }

  skewPoint({ x, y }) {
    return this.skew(x, y)
  }

  invert() {
    const det = this.a * this.d - this.b * this.c
    return this.set(
      this.d / det,
      -this.b / det,
      -this.c / det,
      this.a / det,
      (this.c * this.f - this.d * this.e) / det,
      (this.b * this.e - this.a * this.f) / det
    )
  }

  transformPoint(point) {
    return point.set(
      this.a * point.x + this.c * point.y + this.e,
      this.b * point.x + this.d * point.y + this.f
    )
  }

  equalTo({ a, b, c, d, e, f }) {
    return this.a === a
        && this.b === b
        && this.c === c
        && this.d === d
        && this.e === e
        && this.f === f
  }

  almostEqualTo({ a, b, c, d, e, f }, epsilon = 0.000001) {
    return Math.abs(this.a - a) < epsilon
        && Math.abs(this.b - b) < epsilon
        && Math.abs(this.c - c) < epsilon
        && Math.abs(this.d - d) < epsilon
        && Math.abs(this.e - e) < epsilon
        && Math.abs(this.f - f) < epsilon
  }

  toFixed(fractionDigits = 0) {
    return `Matrix2D(${this.#rawData.map((v) => v.toFixed(fractionDigits)).join(', ')})`
  }

  toString() {
    return `Matrix2D(${this.#rawData.join(', ')})`
  }
}

export default Matrix2D
