/**
 * Linear interpolation
 *
 * @param {number} x
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function linear(x, a, b) {
  return a + x * (b - a)
}

/**
 * Quadratic interpolation
 *
 * @param {number} x
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {number}
 */
export function quadratic(x, a, b, c) {
  return linear(x, linear(x, a, b), linear(x, b, c))
}

/**
 * Cubic interpolation
 *
 * @param {number} x
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @returns {number}
 */
export function cubic(x, a, b, c, d) {
  return linear(x, quadratic(x, a, b, c), quadratic(x, b, c, d))
}

/**
 * Smoothstep function
 *
 * @see https://en.wikipedia.org/wiki/Smoothstep
 * @returns {number}
 */
export function smoothstep(x) {
  return x * x * (3.0 - 2.0 * x);
}

export default {
  linear,
  quadratic,
  cubic,
  smoothstep
}
