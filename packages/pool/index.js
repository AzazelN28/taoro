/**
 * A reference to an object in a pool.
 */
class PoolRef {
  /**
   * The object referenced.
   *
   * @type {*}
   */
  #object = null

  /**
   * Whether this reference is allocated.
   *
   * @type {boolean}
   */
  #inUse = false

  /**
   * Constructor.
   *
   * @param {*} object
   */
  constructor(object) {
    this.#object = object
    this.#inUse = false
  }

  /**
   * Returns the object.
   *
   * @type {*}
   */
  get object() {
    return this.#object
  }

  /**
   * Returns whether this reference is allocated.
   *
   * @type {boolean}
   */
  get inUse() {
    return this.#inUse
  }

  /**
   * Allocate this reference.
   *
   * @returns {*}
   */
  allocate() {
    this.#inUse = true
    return this.#object
  }

  /**
   * Deallocate this reference.
   */
  deallocate() {
    this.#inUse = false
  }
}

/**
 * A pool of objects.
 */
export class Pool {
  /**
   * Number of objects in the pool.
   *
   * @type {number}
   */
  #size = 0

  /**
   * Index of the next object to allocate.
   *
   * @type {number}
   */
  #index = 0

  /**
   * Number of objects currently allocated.
   *
   * @type {number}
   */
  #count = 0

  /**
   * Map of indices to references.
   *
   * @type {Map<number, PoolRef>}
   */
  #indices = new Map()

  /**
   * Array of references to objects.
   *
   * @type {Array<PoolRef>}
   */
  #refs = new Array()

  /**
   * Constructor.
   *
   * @param {number} size Number of objects in the pool.
   * @param {Function} factory Factory function to create objects.
   */
  constructor(size, factory) {
    this.#size = size
    this.#refs = new Array(size)
    for (let index = 0; index < size; index++) {
      const object = factory(index, size)
      this.#refs[index] = new PoolRef(object)
      this.#indices.set(object, index)
    }
  }

  get index() {
    return this.#index
  }

  get size() {
    return this.#size
  }

  get available() {
    return this.#size - this.#count
  }

  get count() {
    return this.#count
  }

  #next() {
    this.#index++
    if (this.#index >= this.#size) {
      this.#index = 0
    }
  }

  allocate() {
    let start = this.#index
    do {
      const ref = this.#refs[this.#index]
      if (!ref.inUse) {
        this.#next()
        ++this.#count
        return ref.allocate()
      }
      this.#next()
    } while (start !== this.#index)
    return null
  }

  deallocate(object) {
    const index = this.#indices.get(object)
    const ref = this.#refs[index]
    if (ref.inUse) {
      --this.#count
      this.#index = index
      ref.deallocate()
      return true
    }
    return false
  }
}

export default Pool
