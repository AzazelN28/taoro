/**
 * Promise executor
 *
 * @typedef {Object} PromiseExecutor
 * @property {function} resolve Function to resolve the promise
 * @property {function} reject Function to reject the promise
 * @property {number} [tid] Timeout handler id
 */

/**
 * A promise map keeps track of promises using an id.
 */
export class PromiseMap {
  /**
   * Map of promises
   *
   * @type {Map<*, Promise>}
   */
  #promises = new Map()

  /**
   * Map of executors
   *
   * @type {Map<*, PromiseExecutor>}
   */
  #executors = new Map()

  /**
   * Creates a new promise with the given id.
   *
   * @param {*} id
   * @param {number} [timeout=60000]
   * @returns {Promise}
   */
  create(id, timeout = 60000) {
    if (this.#executors.has(id) || this.#promises.has(id)) {
      throw new Error(`PromiseMap: Promise ${id} already exists`)
    }
    const promise = new Promise((resolve, reject) => {
      let tid = undefined
      if (Number.isFinite(timeout)) {
        tid = setTimeout(() => {
          reject(new Error(`PromiseMap: Promise ${id} timed out after ${timeout}ms`))
        }, timeout)
      }
      this.#executors.set(id, { resolve, reject, tid })
    })
    this.#promises.set(id, promise)
    return promise
  }

  /**
   * Retrieves the promise executor identified by the id.
   *
   * @param {*} id
   * @returns {PromiseExecutor|null}
   */
  #retrieve(id) {
    if (!this.#executors.has(id)) {
      return null
    }
    const executor = this.#executors.get(id)
    this.#executors.delete(id)
    this.#promises.delete(id)
    return executor
  }

  /**
   * Returns if the promise map contains a promise
   * with that id.
   *
   * @param {*} id
   * @returns {boolean}
   */
  has(id) {
    return this.#promises.has(id)
  }

  /**
   * Resolves the promise identified by the id with the
   * given payload.
   *
   * @param {*} id
   * @param {*} payload
   * @returns {Promise}
   */
  resolve(id, payload) {
    return this.#retrieve(id)?.resolve(payload)
  }

  /**
   * Rejects the promise identified by the id with the
   * given error.
   *
   * @param {*} id
   * @param {Error} error
   * @returns {Promise}
   */
  reject(id, error) {
    return this.#retrieve(id)?.reject(error)
  }

  /**
   * Cancels the promise identified by the id.
   *
   * @param {*} id
   */
  cancel(id) {
    const executor = this.#retrieve(id)
    if (executor?.tid) {
      clearTimeout(executor.tid)
    }
  }
}

export default PromiseMap
