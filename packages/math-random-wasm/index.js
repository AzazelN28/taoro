export class RandomProvider {
  static Kind = {
    LCG: 'lcg',
  }

  /**
   * @type {WebAssembly.Instance}
   */
  static #instance = null

  /**
   * @type {WebAssembly.Module}
   */
  static #module = null

  /**
   * Index
   *
   * @type {number}
   */
  static #currentIndex = 0

  /**
   * Max. index
   *
   * @type {number}
   */
  static #maxIndex = 256

  /**
   * @type {Array<boolean>}
   */
  static #indices = new Array()

  /**
   * Loads and instantiates the necessary WASM modules.
   *
   * @param {URL|string} [url='random.wasm']
   */
  static async load(url = 'random.wasm') {
    const { instance, module } = await WebAssembly.instantiateStreaming(
      fetch(url)
    )
    console.log(instance, module)
    this.#instance = instance
    this.#module = module
    this.#currentIndex = 0
    this.#indices = Array.from(new Array(this.#maxIndex), () => false)
  }

  /**
   * Returns the index of a free random state.
   *
   * @throws {Error} Throws an error if the amount of random states is exhausted
   * @returns {number}
   */
  static allocate() {
    const start = this.#currentIndex
    do {
      if (!this.#indices[this.#currentIndex]) {
        this.#indices[this.#currentIndex] = true
        return this.#currentIndex
      }
      this.#currentIndex = (this.#currentIndex + 1) % this.#maxIndex
    } while (start !== this.#currentIndex)

    throw new Error('Cannot allocate more random states')
  }

  /**
   * Deallocates a random state.
   *
   * @throws {Error} Throws an error if the index was already free
   * @param {number} index
   */
  static deallocate(index) {
    if (this.#indices[index] === false) {
      throw new Error('Invalid random state index to deallocate')
    }
    this.#indices[index] = false
    this.#currentIndex = index
  }

  /**
   * @type {WebAssembly.Instance}
   */
  static get instance() {
    return this.#instance
  }

  /**
   * @type {WebAssembly.Module}
   */
  static get module() {
    return this.#module
  }

  #index = 0
  #kind = 'lcg'
  #seed = 0
  #seeded = false

  /**
   * Constructor
   *
   * @param {number} seed
   * @param {RandomProviderOptions} options
   */
  constructor(seed, options = {}) {
    this.#index = options?.index ?? RandomProvider.allocate()
    this.#kind = options?.kind ?? RandomProvider.Kind.LCG
    this.#seed = seed ?? Date.now()
    this.#seeded = false
  }

  /**
   * The actual seed of the random number generator.
   *
   * @type {number}
   */
  get seed() {
    return RandomProvider.instance.exports[`random_${this.#kind}_get_seed`](
      this.#index
    )
  }

  /**
   * Resets to a new seed
   *
   * @param {number} newSeed
   * @returns {RandomProvider}
   */
  reset(newSeed) {
    RandomProvider.instance.exports[`random_${this.#kind}_reset`](
      this.#index,
      newSeed
    )
    return this
  }

  /**
   * Returns a new value between 0 and 1.
   *
   * @returns {number} A number between 0 (inclusive) and 1 (exclusive)
   */
  next() {
    if (!this.#seeded) {
      RandomProvider.instance.exports[`random_${this.#kind}_reset`](this.#seed)
      this.#seeded = true
    }
    return RandomProvider.instance.exports[`random_${this.#kind}_next`](
      this.#index
    )
  }

  dispose() {
    RandomProvider.deallocate(this.#index)
  }
}

export default RandomProvider
