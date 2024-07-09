export const ELEMENTS = 9

export default class Matrix3 {
  static ELEMENTS = 9

  #rawData = null

  constructor(rawData = new Array(Matrix3.ELEMENTS)) {
    this.#rawData = rawData ?? new Array(Matrix3.ELEMENTS)
  }

  set(...args) {
    if (args.length === 0) return this

    this.#rawData.set(args.slice(0, Matrix3.ELEMENTS), 0)
    return this
  }

  copy({ rawData }) {
    return this.set(...rawData)
  }

  clone() {
    return new Matrix3(this.#rawData.slice(0, Matrix3.ELEMENTS))
  }

  identity() {
    return this.set(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    )
  }

  toString() {
    return `Matrix3(${this.#rawData.join(', ')})`
  }
}
