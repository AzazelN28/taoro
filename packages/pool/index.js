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
    if (!Number.isInteger(size) || size < 1) {
      throw new TypeError('Invalid size')
    }
    this.#size = size
    this.#refs = new Array(size)
    for (let index = 0; index < size; index++) {
      const object = factory(index, size)
      this.#refs[index] = new PoolRef(object)
      this.#indices.set(object, index)
    }
  }

  /**
   * Returns the size of the pool.
   *
   * @type {number}
   */
  get size() {
    return this.#size
  }

  /**
   * Returns the amount of available objects in the
   * pool.
   *
   * @type {number}
   */
  get available() {
    return this.#size - this.#count
  }

  /**
   * Returns the amount of allocated objects.
   *
   * @type {number}
   */
  get count() {
    return this.#count
  }

  /**
   * Returns the next index.
   *
   * @returns {number}
   */
  #next() {
    this.#index = (this.#index + 1) % this.#size
    return this.#index
  }

  /**
   * Allocates a new pooled object.
   *
   * @returns {*}
   */
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

  /**
   * Deallocates a pooled object.
   *
   * @param {*} object
   * @returns {boolean}
   */
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

  /**
   * Deallocates multiple objects.
   *
   * @param {*} objects
   * @returns {boolean}
   */
  deallocateAll(objects) {
    let deallocated = 0
    for (const object of objects) {
      deallocated &= this.deallocate(object)
    }
    return deallocated
  }
}

export default Pool
