/**
 * FastImageData
 */
export class FastImageData {
  /**
   * Creates a new FastImageData instance from ImageData.
   *
   * @param {ImageData} imageData
   * @returns {FastImageData}
   */
  static fromImageData(imageData) {
    if (!(imageData instanceof ImageData)) {
      throw new Error('Invalid ImageData')
    }
    return new FastImageData(
      new Uint32Array(imageData.data.buffer),
      imageData.width,
      imageData.height
    )
  }

  /**
   * Horizontal dimension
   *
   * @type {number}
   */
  #width = 0

  /**
   * Vertical dimension
   *
   * @type {number}
   */
  #height = 0

  /**
   * Image data
   *
   * @type {Uint32Array}
   */
  #data = null

  /**
   * Returns true if the specified size is valid.
   *
   * @param {number} size
   * @returns {boolean}
   */
  #isValidSize(size) {
    return Number.isInteger(size) && size > 0
  }

  /**
   * Returns true if the specified data is valid.
   *
   * @param {Uint32Array} data
   * @param {number} width
   * @param {number} height
   * @returns {boolean}
   */
  #isValidData(data, width, height) {
    return data instanceof Uint32Array && data.length === width * height
  }

  /**
   * Returns true if the specified x coordinate is valid.
   *
   * @param {number} x
   * @returns {boolean}
   */
  #isValidX(x) {
    return Number.isInteger(x) && x >= 0 && x < this.#width
  }

  /**
   * Returns true if the specified y coordinate is valid.
   *
   * @param {number} y
   * @returns {boolean}
   */
  #isValidY(y) {
    return Number.isInteger(y) && y >= 0 && y < this.#height
  }

  /**
   * Constructs a new FastImageData instance from size arguments.
   *
   * @param {number} width
   * @param {number} height
   */
  #constructFromSize(width, height) {
    if (!this.#isValidSize(width)) {
      throw new Error('Invalid width')
    }
    if (!this.#isValidSize(height)) {
      throw new Error('Invalid height')
    }
    this.#width = width
    this.#height = height
    this.#data = new Uint32Array(width * height)
  }

  /**
   * Constructs a new FastImageData instance from data arguments.
   *
   * @param {Uint32Array} data
   * @param {number} width
   * @param {number} height
   */
  #constructFromData(data, width, height) {
    if (!this.#isValidData(data, width, height)) {
      throw new Error('Invalid data')
    }
    if (!this.#isValidSize(width)) {
      throw new Error('Invalid width')
    }
    if (!this.#isValidSize(height)) {
      throw new Error('Invalid height')
    }
    this.#width = width
    this.#height = height
    this.#data = data
  }

  /**
   * Constructor
   *
   * @param  {...any} args
   */
  constructor(...args) {
    if (args.length === 2) {
      this.#constructFromSize(...args)
    } else if (args.length === 3) {
      this.#constructFromData(...args)
    } else {
      throw new Error('Invalid arguments')
    }
  }

  /**
   * Horizontal dimension
   *
   * @readonly
   * @type {number}
   */
  get width() {
    return this.#width
  }

  /**
   * Vertical dimension
   *
   * @readonly
   * @type {number}
   */
  get height() {
    return this.#height
  }

  /**
   * Image data
   *
   * @readonly
   * @type {Uint32Array}
   */
  get data() {
    return this.#data
  }

  /**
   * Returns the offset of the specified coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  #getOffset(x, y) {
    if (!this.#isValidX(x)) {
      throw new RangeError('Invalid x')
    }
    if (!this.#isValidY(y)) {
      throw new RangeError('Invalid y')
    }
    return y * this.#width + x
  }

  /**
   * Sets the color of a pixel.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} color
   * @returns {FastImageData}
   */
  set(x, y, color) {
    const offset = this.#getOffset(x, y)
    this.#data[offset] = color
    return this
  }

  /**
   * Gets the color of a pixel.
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  get(x, y) {
    const offset = this.#getOffset(x, y)
    return this.#data[offset]
  }

  /**
   * Copies data from an ImageData into this FastImageData.
   *
   * @param {ImageData} imageData
   * @param {number} [offset]
   * @returns {FastImageData}
   */
  copyFromImageData(imageData, offset) {
    if (!(imageData instanceof ImageData)) {
      throw new Error('Invalid ImageData')
    }
    this.#data.set(new Uint32Array(imageData.data.buffer), offset)
    return this
  }

  /**
   * Copies data from this FastImageData into an ImageData.
   *
   * @param {ImageData} imageData
   * @param {number} offset
   * @returns {FastImageData}
   */
  copyToImageData(imageData, offset) {
    if (!(imageData instanceof ImageData)) {
      throw new Error('Invalid ImageData')
    }
    imageData.data.set(new Uint8ClampedArray(this.#data.buffer), offset)
    return this
  }

  /**
   * Creates a new ImageData from this FastImageData.
   *
   * @returns {ImageData}
   */
  toImageData() {
    const imageData = new ImageData(this.#width, this.#height)
    imageData.data.set(new Uint8ClampedArray(this.#data.buffer))
    return imageData
  }
}

export default FastImageData
