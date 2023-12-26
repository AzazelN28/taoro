import ResourceLoader from '@taoro/resource-loader'

/**
 * A resource manager that keeps track of all the resources
 * loaded, failed and pending.
 */
export class Resources {
  #promises = new Map()
  #resources = new Map()

  #total = 0
  #loaded = 0
  #failed = 0

  /**
   * Creates a new resources manager.
   *
   * @param {URL|string} baseURL
   */
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  /**
   * The total number of resources.
   *
   * @readonly
   * @type {number}
   */
  get total() {
    return this.#total
  }

  /**
   * The number of resources that have been loaded.
   *
   * @readonly
   * @type {number}
   */
  get loaded() {
    return this.#loaded
  }

  /**
   * The number of resources that have failed to load.
   *
   * @readonly
   * @type {number}
   */
  get failed() {
    return this.#failed
  }

  /**
   * Returns all the promises for the resources.
   *
   * @returns {Promise<[]>}
   */
  all() {
    return Promise.allSettled(this.#promises.values())
  }

  /**
   * Returns true if the resource has been loaded.
   *
   * @param {string} url
   * @returns {boolean}
   */
  has(url) {
    return this.#resources.has(url)
  }

  set(url, resource) {
    this.#resources.set(url, resource)
    return this
  }

  get(url) {
    return this.#resources.get(url)
  }

  delete(url) {
    const resource = this.#resources.has(url)
    if (resource instanceof ImageBitmap) {
      resource.close()
    }
    this.#promises.delete(url)
    this.#resources.delete(url)
    return this
  }

  clear() {
    for (const [url, resource] of this.#resources) {
      if (resource instanceof ImageBitmap) {
        resource.close()
      }
    }
    this.#promises.clear()
    this.#resources.clear()
    return this
  }

  async load(url) {
    ++this.#total
    const resourceURL = new URL(url, this.baseURL)
    let promise = null
    try {
      promise = ResourceLoader.load(resourceURL)
        .then((payload) => {
          ++this.#loaded
          this.#resources.set(url, payload)
        }, (error) => {
          ++this.#failed
          console.error(error)
        })
      this.#promises.set(url, promise)
    } catch (error) {
      ++this.#failed
      console.error(error)
    }
    return promise
  }
}

export default Resources
