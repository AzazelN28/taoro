/**
 * Frame counter.
 */
export class FrameCounter {
  #startTime = 0
  #count = 0
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
    ++this.#count
    if (currentTime - this.#startTime >= 1000) {
      this.#startTime = currentTime
      this.#framesPerSecond = this.#count
      this.#count = 0
    }
  }
}
