export class PromiseMap {
  #promises = new Map()
  #executors = new Map()

  create(id, timeout = 1000) {
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
  }

  #retrieve(id) {
    if (!this.#executors.has(id)) {
      return null
    }
    const executor = this.#executors.get(id)
    this.#executors.delete(id)
    this.#promises.delete(id)
    return executor
  }

  has(id) {
    return this.#promises.has(id)
  }

  resolve(id, payload) {
    return this.#retrieve(id)?.resolve(payload)
  }

  reject(id, error) {
    return this.#retrieve(id)?.reject(error)
  }

  cancel(id) {
    const executor = this.#retrieve(id)
    if (executor?.tid) {
      clearTimeout(executor.tid)
    }
  }
}

export default PromiseMap
