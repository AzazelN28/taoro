export const ELEMENTS = 9

export default class Matrix3 {
  static ELEMENTS = 9

  #rawData = null

  constructor(rawData = new Array(Matrix3.ELEMENTS)) {
    this.#rawData = rawData ?? new Array(Matrix3.ELEMENTS)
  }

  get rawData() {
    return this.#rawData
  }

  get isIdentity() {
    return this.#rawData[0] === 1
        && this.#rawData[1] === 0
        && this.#rawData[2] === 0
        && this.#rawData[3] === 0
        && this.#rawData[4] === 1
        && this.#rawData[5] === 0
        && this.#rawData[6] === 0
        && this.#rawData[7] === 0
        && this.#rawData[8] === 1
  }

  set(...args) {
    if (args.length === 0) return this

    for (let i = 0; i < Math.min(args.length, Matrix3.ELEMENTS); i++) {
      this.#rawData[i] = args[i]
    }
    return this
  }

  reset() {
    return this.#rawData.set()
  }

  copy({ rawData }) {
    return this.set(...rawData)
  }

  clone() {
    return new Matrix3(this.#rawData.slice(0, Matrix3.ELEMENTS))
  }

  reset() {
    return this.set(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    )
  }

  identity() {
    return this.reset()
  }

  toString() {
    return `Matrix3(${this.#rawData.join(', ')})`
  }
}
