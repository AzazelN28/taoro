import { describe, it, expect } from 'vitest'
import Pool from '.'

describe('Pool', () => {
  it('should create a new Pool of objects and allocate and deallocate objects safely', () => {
    class MyPooledObject {}

    const pool = new Pool(2, () => new MyPooledObject())
    const pooledObjectA = pool.allocate()
    expect(pool.size).toBe(2)
    expect(pool.available).toBe(1)
    expect(pool.count).toBe(1)
    expect(pooledObjectA).toBeInstanceOf(MyPooledObject)
    const pooledObjectB = pool.allocate()
    expect(pool.size).toBe(2)
    expect(pool.available).toBe(0)
    expect(pool.count).toBe(2)
    expect(pooledObjectB).toBeInstanceOf(MyPooledObject)
    const nullValue = pool.allocate()
    expect(pool.size).toBe(2)
    expect(pool.available).toBe(0)
    expect(pool.count).toBe(2)
    expect(nullValue).toBeNull()

    expect(pool.deallocate(pooledObjectA)).toBe(true)
    expect(pool.count).toBe(1)
    expect(pool.size).toBe(2)

    const pooledObjectC = pool.allocate()
    expect(pooledObjectC).toBe(pooledObjectA)
    expect(pool.deallocate(pooledObjectA)).toBe(true)
    expect(pool.available).toBe(1)
    expect(pool.count).toBe(1)
    expect(pool.size).toBe(2)

    expect(pool.deallocate(pooledObjectB)).toBe(true)
    expect(pool.available).toBe(2)
    expect(pool.count).toBe(0)
    expect(pool.size).toBe(2)
    expect(pool.deallocate(pooledObjectC)).toBe(false)
    expect(pool.available).toBe(2)
    expect(pool.count).toBe(0)
    expect(pool.size).toBe(2)
  })
})
