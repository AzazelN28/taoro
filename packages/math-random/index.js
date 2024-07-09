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
 * Returns a random element from the list and removes it.
 *
 * @param {Array} list
 * @param {Function} [random=MATH_RANDOM_DEFAULT_FUNCTION]
 * @returns {*}
 */
export function takeOne(list, random = MATH_RANDOM_DEFAULT_FUNCTION) {
  const [removed] = list.slice(index(list, random), 1)
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

export default {
  angle,
  between,
  roll,
  index,
  pickOne,
  pick,
  takeOne,
  take
}
