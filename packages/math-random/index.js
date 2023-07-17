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

export default {
  angle,
  between,
  roll
}
