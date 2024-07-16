import { describe, it, expect } from 'vitest';
import { Sphere } from '.'
import { Vector3 } from '@taoro/math-vector3'
import { Ray } from '@taoro/math-ray'

describe('Sphere', () => {
  it('should create a new Sphere', () => {
    const sphere = new Sphere()
    expect(sphere.center).toBeInstanceOf(Vector3)
    expect(sphere.radius).toBe(1)
  })

  it('should create a new Sphere and intersect a Ray', () => {
    const sphere = new Sphere()
    expect(sphere.center).toBeInstanceOf(Vector3)
    expect(sphere.radius).toBe(1)
    const ray = new Ray()
    expect(sphere.isIntersectedBy(ray)).toBe(true)
  })
})
