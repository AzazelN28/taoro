import { describe, it, expect } from 'vitest'
import { defineVector } from '.'

describe('Custom Vector', () => {
  const Resources = defineVector('Resources', {
    credits: 5,
    science: 4,
    materials: 3,
  })

  const Status = defineVector('Status', {
    health: 100,
    shield: 0,
  })

  it('should instantiate new custom vector', () => {
    const resources = new Resources()
    expect(resources.credits).toBe(5)
    expect(resources.science).toBe(4)
    expect(resources.materials).toBe(3)
  })

  /*
  it('should throw if you try to copy a different custom vector', () => {
    const resources = new Resources()
    const health = new Status()
    expect(() => resources.copy(health)).toThrow()
  })

  it('should add two custom vectors', () => {
    const a = new Resources()
    const b = new Resources()
    a.add(b)
    expect(a.credits).toBe(10)
    expect(a.science).toBe(8)
    expect(a.materials).toBe(6)
  })

  it('should subtract two custom vectors', () => {
    const a = new Resources()
    const b = new Resources()
    a.subtract(b)
    expect(a.credits).toBe(0)
    expect(a.science).toBe(0)
    expect(a.materials).toBe(0)
  })
  */
})
