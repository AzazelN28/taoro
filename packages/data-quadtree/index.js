import { Rect } from '@taoro/math-rect'

/**
 * QuadTreeNode represents a node in a quadtree structure.
 * A quadtree is a tree data structure in which each internal node has exactly four children.
 * Quadtrees are often used to partition a two-dimensional space by recursively subdividing it into four quadrants or regions.
 * This class holds a rectangular region and can have up to four children nodes representing the subdivisions.
 */
export class QuadTreeNode {
  #rect = null

  #topLeft = null
  #topRight = null
  #bottomLeft = null
  #bottomRight = null

  /**
   * Constructor
   *
   * @param {Rect} rect Rectangular area covered by this QuadTreeNode
   */
  constructor(rect) {
    this.#rect = rect
    this.#topLeft = null
    this.#topRight = null
    this.#bottomLeft = null
    this.#bottomRight = null
  }

  /**
   * @type {Rect}
   */
  get rect() {
    return this.#rect
  }

  /**
   * @type {QuadTreeNode}
   */
  get topLeft() {
    return this.#topLeft
  }

  /**
   * @type {QuadTreeNode}
   */
  get topRight() {
    return this.#topRight
  }

  /**
   * @type {QuadTreeNode}
   */
  get bottomLeft() {
    return this.#bottomLeft
  }

  /**
   * @type {QuadTreeNode}
   */
  get bottomRight() {
    return this.#bottomRight
  }

  /**
   * @type {boolean}
   */
  get isLeaf() {
    return this.#topLeft === null
        && this.#topRight === null
        && this.#bottomLeft === null
        && this.#bottomRight === null
  }

  /**
   * @type {boolean}
   */
  get isBranch() {
    return !this.isLeaf
  }

  /**
   * Splits this node if it is a leaf node.
   *
   * @returns {boolean}
   */
  split() {
    // If it is a branch, it is already splitted.
    if (this.isBranch) {
      return false
    }

    const { x, y } = this.#rect
    const halfWidth = this.#rect.halfWidth
    const halfHeight = this.#rect.halfHeight
    this.#topLeft = new QuadTreeNode(new Rect(x, y, halfWidth, halfHeight))
    this.#topRight = new QuadTreeNode(new Rect(x + halfWidth, y, halfWidth, halfHeight))
    this.#bottomLeft = new QuadTreeNode(new Rect(x, y + halfHeight, halfWidth, halfHeight))
    this.#bottomRight = new QuadTreeNode(new Rect(x + halfWidth, y + halfHeight, halfWidth, halfHeight))
    return true
  }

  /**
   * Returns the node that contains the specified coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @returns {QuadTreeNode|null}
   */
  getNodeAt(x, y) {
    if (this.isLeaf && this.rect.contains(x, y)) {
      return this
    }
    for (const node of this) {
      if (!node.rect.contains(x, y)) {
        continue
      }
      return node.getNodeAt(x, y)
    }
    return null
  }

  /**
   * Returns the node that contains the specified point
   *
   * @param {PointLike} point
   * @returns {QuadTreeNode|null}
   */
  getNodeAtPoint({ x, y }) {
    return this.getNodeAt(x, y)
  }

  /**
   * Iterator that iterates through the nodes of this QuadTreeNode
   * starting by the topLeft node and ending in the bottomRight
   */
  *[Symbol.iterator]() {
    yield this.#topLeft
    yield this.#topRight
    yield this.#bottomLeft
    yield this.#bottomRight
  }
}

/**
 * QuadTree
 */
export class QuadTree {
  #root = new QuadTreeNode()

  /**
   * @param {Rect} [rect]
   */
  constructor(rect = null) {
    if (rect) {
      this.#root = new QuadTreeNode(rect)
    }
  }

  /**
   * @type {QuadTreeNode}
   */
  get root() {
    return this.#root
  }

  getNodeAt(x, y) {
    return this.#root.getNodeAt(x, y)
  }

  getNodeAtPoint({ x, y }) {
    return this.getNodeAt(x, y)
  }
}

export default QuadTree
