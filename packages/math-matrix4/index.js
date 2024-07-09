export default class Matrix4 {
  static ELEMENTS = Matrix4.ELEMENTS;

  /**
   * @type {Array<number>}
   */
  #rawData = null

  /**
   *
   * @param {Array<number>} rawData
   */
  constructor(rawData = new Array(Matrix4.ELEMENTS)) {
    this.#rawData = rawData ?? new Array(Matrix4.ELEMENTS)
  }

  get rawData() {
    return this.#rawData
  }

  set(...args) {
    if (args.length === 0)
      return this

    this.#rawData.set(args.slice(0, Matrix4.ELEMENTS), 0)
    return this
  }

  copy({ rawData }) {
    return this.set(...rawData)
  }

  clone() {
    return new Matrix4(this.#rawData.slice(0, Matrix4.ELEMENTS))
  }

  identity() {
    return this.set(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    )
  }

  toString() {
    return `Matrix4(${this.#rawData.join(', ')})`
  }
}
