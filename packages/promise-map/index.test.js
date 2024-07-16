import { describe, it, expect } from 'vitest';
import { PromiseMap } from '.';

describe('PromiseMap', () => {
  it('should create a new PromiseMap and resolve a promise', async () => {
    const promiseMap = new PromiseMap()
    setTimeout(() => promiseMap.resolve(25), 10)
    const promise = promiseMap.create(25)
    await promise
    expect(promiseMap.has(25)).toBeFalsy()
    expect(promiseMap.cancel(25)).toBeFalsy()
    expect(promiseMap.reject(25)).toBeFalsy()
  })

  it('should create a new PromiseMap and reject a promise', async () => {
    const promiseMap = new PromiseMap()
    setTimeout(() => promiseMap.reject(25, new Error('Hola')), 10)
    const promise = promiseMap.create(25)
    try {
      await promise
    } catch (error) {
      // TODO: Throws
    } finally {
      expect(promiseMap.has(25)).toBeFalsy()
      expect(promiseMap.cancel(25)).toBeFalsy()
      expect(promiseMap.reject(25)).toBeFalsy()
    }
  })
})
