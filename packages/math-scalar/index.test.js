import { describe, test, expect } from 'vitest'
import Scalar from '.'

describe('Scalar', () => {
  test('create new Scalar', () => {
    const scalar = new Scalar(25)
    expect(scalar.value).toBe(25)
  })
})
