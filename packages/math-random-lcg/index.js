const MODULUS = Math.pow(2, 31)
const MULTIPLIER = 1103515245
const INCREMENT = 12345
const MASK = (Math.pow(2, 30) - 1)
const DIVISOR = Math.pow(2, 30)

/**
 * Linear Congruential Generator
 *
 * @param {number} x
 * @param {number} a
 * @param {number} c
 * @param {number} m
 * @returns {number}
 */
function lcg(x, a, c, m) {
  return (x * a + c) % m
}

/**
 * Random generator using a LCG (Linear Congruential Generator)
 *
 * @see https://en.wikipedia.org/wiki/Linear_congruential_generator
 */
export class RandomProvider {
  /**
   * Internal seed kept
   *
   * @type {number}
   */
  #seed = 0

  /**
   * Constructor
   *
   * @param {number} [seed=0]
   */
  constructor(seed=0) {
    this.#seed = seed
  }

  /**
   * The actual seed of the random number generator.
   *
   * @type {number}
   */
  get seed() {
    return this.#seed
  }

  /**
   * Resets to a new seed
   *
   * @param {number} newSeed
   */
  reset(newSeed) {
    this.#seed = newSeed
    return this
  }

  /**
   * Returns a new value between 0 and 1.
   *
   * @returns {number} A number between 0 (inclusive) and 1 (exclusive)
   */
  next() {
    this.#seed = lcg(this.#seed, MULTIPLIER, INCREMENT, MODULUS)
    return (this.#seed & MASK) / DIVISOR
  }
}

export default RandomProvider
