export default class Matrix3 {
  #rawData = null

  constructor(rawData = new Array(9)) {
    this.#rawData = rawData ?? new Array(9)
  }

  set(...args) {
    if (args.length === 0) return this

    this.#rawData.set(args.slice(0, 16), 0)
    return this
  }

  copy({ rawData }) {
    return this.set(...rawData)
  }

  clone() {
    return new Matrix3(this.#rawData.slice(0, 16))
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
