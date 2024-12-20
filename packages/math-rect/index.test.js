import { describe, it, expect } from 'vitest'
import Point from '@taoro/math-point'
import Rect from '.'

describe('Rect', () => {
  it('should create a new Rect', () => {
    const rect = new Rect()
    expect(rect.x).toBe(0)
    expect(rect.y).toBe(0)
    expect(rect.width).toBe(0)
    expect(rect.height).toBe(0)
    expect(rect.left).toBe(0)
    expect(rect.top).toBe(0)
    expect(rect.right).toBe(0)
    expect(rect.bottom).toBe(0)
    expect(rect.aspectRatio).toBe(NaN)
    expect(rect.halfWidth).toBe(0)
    expect(rect.halfHeight).toBe(0)
    expect(rect.size).toBeInstanceOf(Point)
    expect(rect.position).toBeInstanceOf(Point)
    expect(rect.centerX).toBe(0)
    expect(rect.centerY).toBe(0)
    expect(rect.isDegenerate).toBe(true)
    expect(rect.isSquare).toBe(true)
    expect(rect.isVertical).toBe(false)
    expect(rect.isHorizontal).toBe(false)
  })

  it('should create a new Rect with specified values', () => {
    const rect = new Rect(-50, -50, 100, 100)
    expect(rect.x).toBe(-50)
    expect(rect.y).toBe(-50)
    expect(rect.width).toBe(100)
    expect(rect.height).toBe(100)
    expect(rect.left).toBe(-50)
    expect(rect.top).toBe(-50)
    expect(rect.right).toBe(50)
    expect(rect.bottom).toBe(50)
    expect(rect.aspectRatio).toBe(1)
    expect(rect.halfWidth).toBe(50)
    expect(rect.halfHeight).toBe(50)
    expect(rect.size).toBeInstanceOf(Point)
    expect(rect.position).toBeInstanceOf(Point)
    expect(rect.centerX).toBe(0)
    expect(rect.centerY).toBe(0)
    expect(rect.isDegenerate).toBe(false)
    expect(rect.isSquare).toBe(true)
    expect(rect.isVertical).toBe(false)
    expect(rect.isHorizontal).toBe(false)
  })

  it('should create a new horizontal Rect with specified values', () => {
    const rect = new Rect(-50, -25, 100, 50)
    expect(rect.x).toBe(-50)
    expect(rect.y).toBe(-25)
    expect(rect.width).toBe(100)
    expect(rect.height).toBe(50)
    expect(rect.left).toBe(-50)
    expect(rect.top).toBe(-25)
    expect(rect.right).toBe(50)
    expect(rect.bottom).toBe(25)
    expect(rect.aspectRatio).toBe(2)
    expect(rect.halfWidth).toBe(50)
    expect(rect.halfHeight).toBe(25)
    expect(rect.size).toBeInstanceOf(Point)
    expect(rect.position).toBeInstanceOf(Point)
    expect(rect.centerX).toBe(0)
    expect(rect.centerY).toBe(0)
    expect(rect.isDegenerate).toBe(false)
    expect(rect.isSquare).toBe(false)
    expect(rect.isVertical).toBe(false)
    expect(rect.isHorizontal).toBe(true)
  })

  it('should create a new vertical Rect with specified values', () => {
    const rect = new Rect(-25, -50, 50, 100)
    expect(rect.x).toBe(-25)
    expect(rect.y).toBe(-50)
    expect(rect.width).toBe(50)
    expect(rect.height).toBe(100)
    expect(rect.left).toBe(-25)
    expect(rect.top).toBe(-50)
    expect(rect.right).toBe(25)
    expect(rect.bottom).toBe(50)
    expect(rect.aspectRatio).toBe(0.5)
    expect(rect.halfWidth).toBe(25)
    expect(rect.halfHeight).toBe(50)
    expect(rect.size).toBeInstanceOf(Point)
    expect(rect.position).toBeInstanceOf(Point)
    expect(rect.centerX).toBe(0)
    expect(rect.centerY).toBe(0)
    expect(rect.isDegenerate).toBe(false)
    expect(rect.isSquare).toBe(false)
    expect(rect.isVertical).toBe(true)
    expect(rect.isHorizontal).toBe(false)
  })

  describe('createFromXYWH', () => {
    it('should create a Rect with the correct dimensions', () => {
      const rect = Rect.createFromXYWH(1, 2, 3, 4)
      expect(rect.left).toBe(1)
      expect(rect.top).toBe(2)
      expect(rect.width).toBe(3)
      expect(rect.height).toBe(4)
    })

    it('should create a Rect with default values when no arguments are provided', () => {
      const rect = Rect.createFromXYWH()
      expect(rect.left).toBe(0)
      expect(rect.top).toBe(0)
      expect(rect.width).toBe(0)
      expect(rect.height).toBe(0)
    })

    it('should create a Rect with negative width and height if width or height are negative', () => {
      const rect = Rect.createFromXYWH(1, 2, -3, -4)
      expect(rect.left).toBe(1)
      expect(rect.top).toBe(2)
      expect(rect.width).toBe(-3)
      expect(rect.height).toBe(-4)
    })
  })

  describe('createFromLTRB', () => {
    it('should create a Rect with the correct dimensions', () => {
      const rect = Rect.createFromLTRB(1, 2, 3, 4)
      expect(rect.left).toBe(1)
      expect(rect.top).toBe(2)
      expect(rect.width).toBe(2)
      expect(rect.height).toBe(2)
      expect(rect.isDegenerate).toBe(false)
    })

    it('should create a Rect with default values when no arguments are provided', () => {
      const rect = Rect.createFromLTRB()
      expect(rect.left).toBe(0)
      expect(rect.top).toBe(0)
      expect(rect.width).toBe(0)
      expect(rect.height).toBe(0)
      expect(rect.isDegenerate).toBe(true)
    })

    it('should create a Rect with negative width and height if right < left or bottom < top', () => {
      const rect = Rect.createFromLTRB(4, 3, 1, 2)
      expect(rect.left).toBe(4)
      expect(rect.top).toBe(3)
      expect(rect.width).toBe(-3)
      expect(rect.height).toBe(-1)
      expect(rect.isDegenerate).toBe(true)
    })
  })

  describe('isRect', () => {
    it('should return true for an instance of Rect', () => {
      const rect = new Rect(1, 2, 3, 4)
      expect(Rect.isRect(rect)).toBe(true)
    })

    it('should return false for an object that is not an instance of Rect', () => {
      const notRect = { left: 1, top: 2, width: 3, height: 4 }
      expect(Rect.isRect(notRect)).toBe(false)
    })

    it('should return false for null', () => {
      expect(Rect.isRect(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(Rect.isRect(undefined)).toBe(false)
    })

    it('should return false for a primitive value', () => {
      expect(Rect.isRect(42)).toBe(false)
    })
  })

  describe('isRectLike', () => {
    it('should return true for an object with x, y, width, and height properties', () => {
      const rectLike = { x: 1, y: 2, width: 3, height: 4 }
      expect(Rect.isRectLike(rectLike)).toBe(true)
    })

    it('should return false for an object missing one of the required properties', () => {
      const rectLike = { x: 1, y: 2, width: 3 }
      expect(Rect.isRectLike(rectLike)).toBe(false)
    })

    it('should return false for an object with non-number properties', () => {
      const rectLike = { x: '1', y: 2, width: 3, height: 4 }
      expect(Rect.isRectLike(rectLike)).toBe(false)
    })

    it('should return false for null', () => {
      expect(Rect.isRectLike(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(Rect.isRectLike(undefined)).toBe(false)
    })

    it('should return false for a primitive value', () => {
      expect(Rect.isRectLike(42)).toBe(false)
    })
  })
})
