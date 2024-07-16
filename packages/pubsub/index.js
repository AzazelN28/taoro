class Subscriber {
  #topics = []
  #callback = null

  constructor(callback, topics = []) {
    if (typeof callback !== 'function') {
      throw new Error('')
    }
    if (!Array.isArray(topics)) {
      throw new Error('Invalid topics')
    }
    this.#topics = topics
    this.#callback = callback
  }

  has(topic) {
    return this.#topics.includes(topic)
  }

  hasAny(topics) {
    return topics.some((topic) => this.#topics.includes(topic))
  }

  matches(topics) {
    // If we don't have any specific topics, then
    // we are subscribed to ALL topics.
    if (this.#topics.length === 0) {
      return true
    }
    // If we are subscribed to a specific topic but
    // the message doesn't specify an specific topic
    // then we aren't interested.
    if (topics.length === 0) {
      return false
    }
    // Otherwise we see if we're subscribed to any
    // of the topics passed.
    return hasAny(topics)
  }

  notify(payload) {
    return this.#callback(payload)
  }
}

/**
 * PubSub
 */
export class PubSub {
  /**
   * List of subscribers to this PubSub
   *
   * @type {Array<Subscriber>}
   */
  #subscribers = []

  /**
   * Subscribes to one or to multiple topics.
   *
   * @param {Function} callback
   * @param  {...any} topics
   * @returns {Subscriber}
   */
  subscribe(callback, ...topics) {
    const subscriber = new Subscriber(callback, topics)
    this.#subscribers.push(subscriber)
    return subscriber
  }

  /**
   * Unsubscribes the subscriber.
   *
   * @param {Subscriber} subscriber
   * @returns {boolean}
   */
  unsubscribe(subscriber) {
    const index = this.#subscribers.indexOf(subscriber)
    if (index === -1) {
      return false
    }
    this.#subscribers.splice(index, 1)
    return true
  }

  /**
   * Publish some info into some topics.
   *
   * @param {*} payload
   * @param {...any} topics
   * @returns {PubSub}
   */
  publish(payload, ...topics) {
    for (const subscriber of this.#subscribers) {
      if (!subscriber.matches(topics)) {
        continue
      }
      subscriber.notify(payload)
    }
    return this
  }
}

export default PubSub
