/**
 * Frame counter.
 */
export class FrameCounter {
  /**
   * Start time.
   *
   * @type {number}
   */
  #startTime = 0

  /**
   * Number of frames counted since start time.
   *
   * @type {number}
   */
  #count = 0

  /**
   * Amount of frames since last second.
   *
   * @type {number}
   */
  #framesPerSecond = 0

  /**
   * Creates a new frame counter.
   *
   * @param {number} initialTime
   */
  constructor(initialTime = 0) {
    this.#startTime = initialTime
  }

  /**
   * Number of frames per second.
   *
   * @type {number}
   */
  get framesPerSecond() {
    return this.#framesPerSecond
  }

  /**
   * Updates the frame counter.
   *
   * @param {number} currentTime
   */
  update(currentTime) {
    if (currentTime - this.#startTime >= 1000) {
      this.#startTime = currentTime
      this.#framesPerSecond = this.#count
      this.#count = 0
    }
    ++this.#count
  }
}
