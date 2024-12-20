import { describe, it, expect} from 'vitest'
import Rect from '@taoro/math-rect'
import { QuadTree, QuadTreeNode } from '.'

describe('QuadTree', ()  => {
  it('should create a new empty QuadTree', () => {
    const quadTree = new QuadTree()
    expect(quadTree.root).toBeInstanceOf(QuadTreeNode)
  })

  it('should create a new QuadTree with specified values', () => {
    const quadTree = new QuadTree(new Rect(-50, -50, 100, 100))
    expect(quadTree.root.split()).toBe(true)
    expect(quadTree.root.topLeft.rect.x).toBe(-50)
    expect(quadTree.root.topLeft.rect.y).toBe(-50)
    expect(quadTree.root.topLeft.rect.width).toBe(50)
    expect(quadTree.root.topLeft.rect.height).toBe(50)
    expect(quadTree.root.topRight.rect.x).toBe(0)
    expect(quadTree.root.topRight.rect.y).toBe(-50)
    expect(quadTree.root.topRight.rect.width).toBe(50)
    expect(quadTree.root.topRight.rect.height).toBe(50)
    expect(quadTree.root.bottomLeft.rect.x).toBe(-50)
    expect(quadTree.root.bottomLeft.rect.y).toBe(0)
    expect(quadTree.root.bottomLeft.rect.width).toBe(50)
    expect(quadTree.root.bottomLeft.rect.height).toBe(50)
    expect(quadTree.root.bottomRight.rect.x).toBe(0)
    expect(quadTree.root.bottomRight.rect.y).toBe(0)
    expect(quadTree.root.bottomRight.rect.width).toBe(50)
    expect(quadTree.root.bottomRight.rect.height).toBe(50)
  })

  it('should create a new QuadTree and traverse it based on coordinates', () => {
    const quadTree = new QuadTree(new Rect(-50, -50, 100, 100))
    expect(quadTree.root.split()).toBe(true)
    const node = quadTree.getNodeAt(0, 0)
    console.log(node.rect.toString())
  })
})
