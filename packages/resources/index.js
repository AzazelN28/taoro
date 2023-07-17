import ResourceLoader from '@taoro/resource-loader'

export class Resources {
  #promises = new Map()
  #resources = new Map()

  #total = 0
  #loaded = 0
  #failed = 0

  constructor(baseURL) {
    this.baseURL = baseURL
  }

  get total() {
    return this.#total
  }

  get loaded() {
    return this.#loaded
  }

  get failed() {
    return this.#failed
  }

  all() {
    return Promise.allSettled(this.#promises.values())
  }

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
