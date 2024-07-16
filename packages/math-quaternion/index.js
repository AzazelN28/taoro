export class Quaternion {
  static NUM_ELEMENTS = 4

  static X = 0
  static Y = 1
  static Z = 2
  static W = 3

  #rawData = null

  static multiply(out, { x: ax, y: ay, z: az, w: aw }, { x: bx, y: by, z: bz, w: bw }) {
    return out.set(
		  ax * bw + aw * bx + ay * bz - az * by,
		  ay * bw + aw * by + az * bx - ax * bz,
		  az * bw + aw * bz + ax * by - ay * bx,
		  aw * bw - ax * bx - ay * by - az * bz
    )
  }

  /**
   * Constructor
   *
   * @param {Float32Array|Float64Array} [Type=Float32Array]
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   * @param {number} [w=1]
   */
  constructor(Type = Float32Array, x = 0, y = 0, z = 0, w = 1) {
    this.#rawData = new Type([x || 0, y || 0, z || 0, w || 1])
  }

  get x() { return this.#rawData[Quaternion.X] }
  set x(x) { this.#rawData[Quaternion.X] = x }

  get y() { return this.#rawData[Quaternion.Y] }
  set y(y) { this.#rawData[Quaternion.Y] = y}

  get z() { return this.#rawData[Quaternion.Z] }
  set z(z) { this.#rawData[Quaternion.Z] = z }

  get w() { return this.#rawData[Quaternion.W] }
  set w(w) { this.#rawData[Quaternion.W] = w }

  get length() {
    return Math.hypot(this.x, this.y, this.z, this.w)
  }

  get lengthSquared() {
    return this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2
  }

  get isIdentity() {
    return this.x === 0
        && this.y === 0
        && this.z === 0
        && this.w === 1
  }

  set(x, y, z, w) {
    this.#rawData.set([x, y, z, w], 0)
    return this
  }

  reset() {
    return this.set(0, 0, 0, 1)
  }

  identity() {
    return this.reset()
  }

  copy({ x, y, z, w }) {
    return this.set(x, y, z, w)
  }

  clone() {
    return new Quaternion(
      this.#rawData.constructor,
      this.x,
      this.y,
      this.z,
      this.w
    )
  }

  dot({ x, y, z, w }) {
    return this.x * x + this.y * y + this.z * z + this.w * w
  }

  normalize() {
    const l = this.length
    if (l === 0) {
      return this.reset()
    }
    return this.set(
      this.x / l,
      this.y / l,
      this.z / l,
      this.w / l,
    )
  }

  invert() {
    return this.set(
      -this.x,
      -this.y,
      -this.z,
      this.w
    )
  }

  conjugate() {
    return this.invert()
  }

  toFixed(fractionDigits) {
    return `Quaternion(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(fractionDigits)}, ${this.z.toFixed(fractionDigits)}, ${this.w.toFixed(fractionDigits)})`
  }

  toString() {
    return `Quaternion(${this.x}, ${this.y}, ${this.z}, ${this.w})`
  }
}
