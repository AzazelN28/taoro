export class Random {
  #provider = null

  constructor(provider) {
    this.#provider = provider
  }

  angle() {
    return this.#provider.next() * Math.PI * 2 - Math.PI
  }

  between(min, max) {
    return min + this.#provider.next() * (max - min)
  }

  intBetween(min, max) {
    return min + Math.floor(this.#provider.next() * (max - min))
  }

  roll(sides) {
    return 1 + Math.floor(this.#provider.next() * sides)
  }

  value() {
    return this.#provider.next()
  }

  index(list) {
    return Math.floor(this.#provider.next() * list.length)
  }

  pickOne(list) {
    return list[this.index(list)]
  }

  pick(list) {
    const result = []
    for (let i = 0; i < count; i++) {
      result.push(this.pickOne(list))
    }
    return result
  }

  takeOne(list) {
    const [removed] = list.slice(this.index(list), 1)
    return removed
  }

  take(list, count){
    const result = []
    for (let i = 0; i < count; i++) {
      const value = this.takeOne(list)
      if (value !== undefined) {
        result.push(value)
      }
    }
    return result
  }
}

/**
 * The random function used as default for every function.
 *
 * @type {Function}
 */
export const MATH_RANDOM_DEFAULT_FUNCTION = Math.random

/**
 * Return a random angle in radians.
 *
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {number}
 */
export function angle(random = MATH_RANDOM_DEFAULT_FUNCTION) {
  return (random() * Math.PI * 2) - Math.PI
}

/**
 * Return a random number between min and max.
 *
 * @param {number} min
 * @param {number} max
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {number}
 */
export function between(min, max, random = MATH_RANDOM_DEFAULT_FUNCTION) {
  return min + random() * (max - min)
}

/**
 * Return a random number between 1 and sides.
 *
 * @param {number} sides
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {number}
 */
export function roll(sides, random = MATH_RANDOM_DEFAULT_FUNCTION) {
  return 1 + Math.floor(random() * sides)
}

/**
 * Return a random index from the list.
 *
 * @param {Array} list
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {number}
 */
export function index(list, random = MATH_RANDOM_DEFAULT_FUNCTION) {
  return Math.floor(random() * list.length)
}

/**
 * Return a random index from the list with weights.
 *
 * @param {Array} list
 * @param {Array} weights
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {number}
 */
export function indexWeighted(list, weights, random = MATH_RANDOM_DEFAULT_FUNCTION) {
  if (list.length !== weights.length) {
    throw new Error('Items and weights must be of the same size')
  }
  if (!list.length) {
    throw new Error('Items must not be empty')
  }
  const cumulativeWeights = []
  for (let i = 0; i < weights.length; i += 1) {
    cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0)
  }
  const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1]
  const randomNumber = maxCumulativeWeight * random()
  for (let index = 0; index < list.length; index += 1) {
    if (cumulativeWeights[index] >= randomNumber) {
      return index
    }
  }
}

/**
 * Returns a random element from the list.
 *
 * @param {Array} list
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {*}
 */
export function pickOne(list, random = MATH_RANDOM_DEFAULT_FUNCTION) {
  return list[index(list, random)]
}

/**
 * Returns a random element from the list with weights.
 *
 * @param {Array} list
 * @param {Array} weights
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {*}
 */
export function pickOneWeighted(list, weights, random = MATH_RANDOM_DEFAULT_FUNCTION) {
  return list[indexWeighted(list, weights, random)]
}

/**
 * Returns the specified number of random elements from the list.
 *
 * @param {Array} list
 * @param {number} count
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {Array<*>}
 */
export function pick(list, count, random = MATH_RANDOM_DEFAULT_FUNCTION) {
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(pickOne(list, random))
  }
  return result
}

/**
 * Returns the specified number of random elements from the list with weights.
 *
 * @param {Array} list
 * @param {Array} weights
 * @param {number} count
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {Array<*>}
 */
export function pickWeighted(list, weights, count, random = MATH_RANDOM_DEFAULT_FUNCTION) {
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(pickOneWeighted(list, weights, random))
  }
  return result
}

/**
 * Returns a random element from the list and removes it.
 *
 * @param {Array} list
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {*}
 */
export function takeOne(list, random = MATH_RANDOM_DEFAULT_FUNCTION) {
  const [removed] = list.splice(index(list, random), 1)
  return removed
}

/**
 * Returns a random element from the list with weights and removes it.
 *
 * @param {Array} list
 * @param {Array} weights
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {*}
 */
export function takeOneWeighted(list, weights, random = Math.random) {
  const index = indexWeighted(list, weights, random);
  const [removed] = list.splice(index, 1)
  weights.splice(index, 1)
  return removed
}

/**
 * Returns the specified number of random elements from the
 * list and removes them.
 *
 * @param {Array} list
 * @param {number} count
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {Array<*>}
 */
export function take(list, count, random = MATH_RANDOM_DEFAULT_FUNCTION) {
  const result = []
  for (let i = 0; i < count; i++) {
    const value = takeOne(list, random)
    if (value !== undefined) {
      result.push(value)
    }
  }
  return result
}

/**
 * Returns the specified number of random elements from the
 * list with weights and removes them.
 *
 * @param {Array} list
 * @param {Array} weights
 * @param {number} count
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {Array<*>}
 */
export function takeWeighted(list, weights, count, random = MATH_RANDOM_DEFAULT_FUNCTION) {
  const result = []
  for (let i = 0; i < count; i++) {
    const value = takeOneWeighted(list, weights, random)
    if (value !== undefined) {
      result.push(value)
    }
  }
  return result
}

export default {
  Random,
  angle,
  between,
  roll,
  index,
  indexWeighted,
  pickOne,
  pickOneWeighted,
  pick,
  pickWeighted,
  takeOne,
  takeOneWeighted,
  take,
  takeWeighted
}
