export const TAU = Math.PI * 2

export const HALF_PI = Math.PI / 2
export const QUARTER_PI = Math.PI / 4

export const DEG_TO_RAD = Math.PI / 180
export const RAD_TO_DEG = 180 / Math.PI

/**
 * Convert degrees to radians.
 *
 * @param {number} degrees
 * @returns {number}
 */
export function degreesToRadians(degrees) {
  return degrees * DEG_TO_RAD
}

/**
 * Convert radians to degrees.
 *
 * @param {number} radians
 * @returns {number}
 */
export function radiansToDegrees(radians) {
  return radians * RAD_TO_DEG
}

/**
 * Clamp an angle between -PI and PI.
 *
 * @param {number} value
 * @returns {number}
 */
export function normalize(value) {
  if (value < 0) {
    const times = Math.abs(Math.floor(value / TAU))
    return (value + times * TAU) - Math.PI
  } else if (value > Math.PI * 2) {
    const times = Math.floor(value / TAU)
    return (value - times * TAU) - Math.PI
  }
  return value - Math.PI
}

/**
 * Return the shortest arc between two angles.
 *
 * @param {number} a Angle a
 * @param {number} b Angle b
 * @returns {number}
 */
export function shortestArc(a, b) {
  if (Math.abs(b - a) < Math.PI) {
    return b - a
  }
  if (b > a) {
    return b - a - TAU
  }
  return b - a + TAU
}

export default {
  TAU,
  HALF_PI,
  QUARTER_PI,
  DEG_TO_RAD,
  RAD_TO_DEG,
  degreesToRadians,
  radiansToDegrees,
  normalize,
  shortestArc
}
