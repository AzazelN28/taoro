import { describe, it, expect } from 'vitest'
import { Runnable } from '.';

describe('Runnable', () => {
  it('should create a new Runnable', () => {
    const runnable = new Runnable(false)
    expect(runnable.isRunning).toBe(false)
    expect(runnable.start()).toBe(true)
    expect(runnable.start()).toBe(false)
    expect(runnable.isRunning).toBe(true)
    expect(runnable.stop()).toBe(true)
    expect(runnable.stop()).toBe(false)
  })

  it('should create a new Runnable that it is running', () => {
    const runnable = new Runnable(true)
    expect(runnable.isRunning).toBe(true)
    expect(runnable.start()).toBe(false)
    expect(runnable.isRunning).toBe(true)
    expect(runnable.stop()).toBe(true)
    expect(runnable.stop()).toBe(false)
    expect(runnable.isRunning).toBe(false)
    expect(runnable.start()).toBe(true)
    expect(runnable.isRunning).toBe(true)
  })
})
