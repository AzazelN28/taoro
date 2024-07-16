import { describe, it, expect } from 'vitest'
import { Scheduler } from '.'

describe('Scheduler', () => {
  function* Task() {
    let count = 0
    while (count < 3) {
      count++
      yield
    }
  }

  function waitFor(time) {
    return new Promise((resolve) => setTimeout(() => resolve(), time))
  }

  async function * AsyncTask() {
    let count = 0
    while (count < 3) {
      count++
      yield await waitFor(10)
    }
  }

  it('should create new Scheduler and add an iterator', () => {
    const scheduler = new Scheduler()
    const iterator = Task()

    expect(scheduler.add(iterator)).toBe(scheduler)
    expect(scheduler.has(iterator)).toBe(true)
    scheduler.update() // 0
    expect(scheduler.has(iterator)).toBe(true)
    scheduler.update() // 1
    expect(scheduler.has(iterator)).toBe(true)
    scheduler.update() // 2
    expect(scheduler.has(iterator)).toBe(true)
    scheduler.update() // 3
    expect(scheduler.has(iterator)).toBe(false)
  })

  it('should create a new Scheduler and clear iterators', () => {
    const scheduler = new Scheduler()
    const iterator = Task()

    expect(scheduler.add(iterator)).toBe(scheduler)
    expect(scheduler.has(iterator)).toBe(true)
    expect(scheduler.clear()).toBe(scheduler)
    expect(scheduler.has(iterator)).toBe(false)
  })

  it('should create a new Scheduler and delete an iterator', () => {
    const scheduler = new Scheduler()
    const iterator = Task()

    expect(scheduler.add(iterator)).toBe(scheduler)
    expect(scheduler.has(iterator)).toBe(true)
    expect(scheduler.delete(iterator)).toBe(scheduler)
    expect(scheduler.has(iterator)).toBe(false)
  })

  it('should create a new Scheduler and add an asyncIterator', async () => {
    const scheduler = new Scheduler()
    const iterator = AsyncTask()

    expect(scheduler.add(iterator)).toBe(scheduler)
    expect(scheduler.has(iterator)).toBe(true)
    scheduler.update() // 0
    scheduler.update() // 1
    scheduler.update() // 2
    scheduler.update() // 3
    expect(scheduler.has(iterator)).toBe(false)
  })

  it('should throw if you add an invalid iterator', () => {
    const scheduler = new Scheduler()
    const iterator = Infinity
    expect(() => scheduler.add(iterator)).toThrowError('Task is not iterable')
  })
})
