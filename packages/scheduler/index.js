/**
 * Scheduler
 */
export class Scheduler {
  #iterators = new Set()

  /**
   * Updates the scheduler by calling next() on each
   * iterator (task). If a task is async (returns a
   * promise) it will be added back to the list once
   * the promise is resolved.
   *
   * @returns {Scheduler}
   */
  update() {
    for (const iterator of this.#iterators) {
      const result = iterator.next()
      if (result instanceof Promise) {
        this.#iterators.delete(iterator)
        result.then(() => this.#iterators.add(iterator))
      } else if (result.done) {
        this.#iterators.delete(iterator)
      }
    }
    return this
  }

  /**
   * Clears the scheduler.
   *
   * @returns {Scheduler}
   */
  clear() {
    this.#iterators.clear()
    return this
  }

  /**
   * Returns true if the scheduler has the iterator (task)
   *
   * @param {*} iterator
   * @returns {boolean}
   */
  has(iterator) {
    return this.#iterators.has(iterator)
  }

  /**
   * Adds an iterator (task) to the scheduler
   *
   * @param {*} iterator
   * @returns {Scheduler}
   */
  add(iterator) {
    if (!(Symbol.iterator in iterator)
     && !(Symbol.asyncIterator in iterator)) {
      throw new TypeError('Task is not iterable')
    }
    this.#iterators.add(iterator)
    return this
  }

  /**
   * Deletes an iterator (task) from the scheduler
   *
   * @param {*} iterator
   * @returns {Scheduler}
   */
  delete(iterator) {
    this.#iterators.delete(iterator)
    return this
  }
}

export default Scheduler
