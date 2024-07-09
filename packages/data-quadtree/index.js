import { Rect } from '@taoro/math-rect'

export class QuadNode {
  #rect = null

  #topLeft = null
  #topRight = null
  #bottomLeft = null
  #bottomRight = null

  /**
   *
   * @param {Rect} rect
   */
  constructor(rect) {
    this.#rect = rect
    this.#topLeft = null
    this.#topRight = null
    this.#bottomLeft = null
    this.#bottomRight = null
  }

  get rect() {
    return this.#rect
  }

  get topLeft() {
    return this.#topLeft
  }

  get topRight() {
    return this.#topRight
  }

  get bottomLeft() {
    return this.#bottomLeft
  }

  get bottomRight() {
    return this.#bottomRight
  }

  get isLeaf() {
    return this.#topLeft !== null
        && this.#topRight !== null
        && this.#bottomLeft !== null
        && this.#bottomRight !== null
  }

  split() {
    if (this.isLeaf) {
      return false
    }

    const { x, y } = this.#rect
    const halfWidth = this.#rect.halfWidth
    const halfHeight = this.#rect.halfHeight
    this.#topLeft = new QuadNode(new Rect(x, y, halfWidth, halfHeight))
    this.#topRight = new QuadNode(new Rect(x + halfWidth, y))
    this.#bottomLeft = new QuadNode(new Rect(x, y + halfHeight))
    this.#bottomRight = new QuadNode(new Rect(x + halfWidth, y + halfHeight))
    return true
  }

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

  getNodeAtPoint({ x, y }) {
    return this.getNodeAt(x, y)
  }

  *[Symbol.iterator]() {
    yield this.#topLeft
    yield this.#topRight
    yield this.#bottomLeft
    yield this.#bottomRight
  }
}

export class QuadTree {
  #root = new QuadNode()

  constructor() {

  }

  getNodeAt(x, y) {
    return this.#root.getNodeAt(x, y)
  }

  getNodeAtPoint({ x, y }) {
    return this.getNodeAt(x, y)
  }
}
