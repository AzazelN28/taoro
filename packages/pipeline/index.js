export class Pipeline {
  /**
   *
   * @param {*} pipeline
   * @returns {boolean}
   */
  static isPipeline(pipeline) {
    return pipeline instanceof Pipeline
  }

  /**
   *
   * @param {[string, Function]} pair
   * @returns {boolean}
   */
  static isPipelinePair(pair) {
    return Array.isArray(pair) && typeof pair[0] === 'string' && typeof pair[1] === 'function'
  }

  #pipeline = []

  constructor(pipeline = []) {
    this.#pipeline = pipeline ?? []
  }

  get length() {
    return this.#pipeline.length
  }

  keys() {
    return this.#pipeline.map(([tag]) => tag)
  }

  values() {
    return this.#pipeline.map(([_, fn]) => fn)
  }

  entries() {
    return this.#pipeline.map((entry) => entry)
  }

  unshift(...items) {
    return this.#pipeline.unshift(...items.map((item) => {
      if (Pipeline.isPipelinePair(item)) {
        return item
      }
      if (typeof item !== 'function') {
        throw new TypeError('Invalid pipeline item')
      }
      return ['', item]
    }))
  }

  shift() {
    return this.#pipeline.shift()
  }

  push(...items) {
    return this.#pipeline.push(...items.map((item) => {
      if (Pipeline.isPipelinePair(item)) {
        return item
      }
      if (typeof item !== 'function') {
        throw new TypeError('Invalid pipeline item')
      }
      return ['', item]
    }))
  }

  pop() {
    return this.#pipeline.pop()
  }

  forEach(fn) {
    for (let index = 0; index < this.#pipeline.length; index++) {
      const [tag, step] = this.#pipeline[index]
      fn(step, tag, this)
    }
  }

  after(tag, newTag, fn) {
    const index = this.#pipeline.findIndex(([currentTag]) => currentTag === tag)
    if (index < 0) {
      throw new Error(`Tag ${tag} not found`)
    }
    this.#pipeline.splice(index + 1, 0, [newTag, fn])
    return this
  }

  before(tag, newTag, fn) {
    const index = this.#pipeline.findIndex(([currentTag]) => currentTag === tag)
    if (index < 0) {
      throw new Error(`Tag ${tag} not found`)
    }
    this.#pipeline.splice(index, 0, [newTag, fn])
    return this
  }

  remove(tag) {
    const index = this.#pipeline.findIndex(([currentTag]) => currentTag === tag)
    if (index < 0) {
      throw new Error(`Tag ${tag} not found`)
    }
    const [removed] = this.#pipeline.splice(index, 1)
    return removed
  }

  *[Symbol.iterator]() {
    for (const [tag, fn] of this.#pipeline) {
      yield fn
    }
  }
}

export default Pipeline
