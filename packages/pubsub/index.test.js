import { describe, it, expect } from 'vitest'
import { PubSub } from '.'

describe('PubSub', () => {
  const pubSub = new PubSub()

  it('should subscribe to a topic', () => {
    const subscriber = pubSub.subscribe(() => {}, 'foo')
    expect(subscriber.has('foo')).toBe(true)
  })
})
