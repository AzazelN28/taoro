import { describe, it, expect } from 'vitest'
import { FrameCounter } from '.'

describe('FrameCounter', () => {
  it('should create a new FrameCounter', () => {
    let time = 0
    const deltaTime = 1000 / 60
    const frameCounter = new FrameCounter(time)
    for (let i = 0; i <= 60; i++) {
      time += deltaTime
      frameCounter.update(time)
    }
    expect(frameCounter.framesPerSecond).toBe(60)
  })
})
