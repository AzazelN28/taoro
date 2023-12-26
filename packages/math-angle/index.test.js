import { describe, test, expect } from 'vitest'
import Angle from './index.js'

describe('Angle', () => {
  test('TAU is equal to 2 * PI', () => expect(Angle.TAU).toBe(2 * Math.PI))
  test('HALF_PI is equal to PI / 2', () => expect(Angle.HALF_PI).toBe(Math.PI / 2))
  test('QUARTER_PI is equal to PI / 4', () => expect(Angle.QUARTER_PI).toBe(Math.PI / 4))

  test('DEG_TO_RAD is equal to PI / 180', () => expect(Angle.DEG_TO_RAD).toBe(Math.PI / 180))
  test('RAD_TO_DEG is equal to 180 / PI', () => expect(Angle.RAD_TO_DEG).toBe(180 / Math.PI))

  test('degreesToRadians(180) is equal to PI', () => expect(Angle.degreesToRadians(180)).toBe(Math.PI))
  test('radiansToDegrees(PI) is equal to 180', () => expect(Angle.radiansToDegrees(Math.PI)).toBe(180))

  test('normalize(0) is equal to -PI', () => expect(Angle.normalize(0)).toBe(-Math.PI))
  test('normalize(PI) is equal to 0', () => expect(Angle.normalize(Math.PI)).toBe(0))
  test('normalize(2 * PI) is equal to PI', () => expect(Angle.normalize(2 * Math.PI)).toBe(Math.PI))
  test('normalize(3 * PI) is equal to 0', () => expect(Angle.normalize(3 * Math.PI)).toBe(0))
  test('normalize(-PI) is equal to 0', () => expect(Angle.normalize(-Math.PI)).toBe(0))
  test('normalize(-2 * PI) is equal to -PI', () => expect(Angle.normalize(-2 * Math.PI)).toBe(-Math.PI))
  test('normalize(-3 * PI) is equal to 0', () => expect(Angle.normalize(-3 * Math.PI)).toBe(0))

  test('shortestArc(0, PI) is equal to -PI', () => expect(Angle.shortestArc(0, Math.PI)).toBe(-Math.PI))
  test('shortestArc(PI, 0) is equal to PI', () => expect(Angle.shortestArc(Math.PI, 0)).toBe(Math.PI))
})
