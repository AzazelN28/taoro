import { Runnable } from '@taoro/runnable'
import { Loop } from '@taoro/loop'
import { Input } from '@taoro/input'
import { Audio } from '@taoro/audio'
import { Music } from '@taoro/audio-music'
import { Sound } from '@taoro/audio-sound'
import { Resources } from '@taoro/resources'
import { Scheduler } from '@taoro/scheduler'
import { Viewport } from '@taoro/viewport'
import { FrameCounter } from '@taoro/frame-counter'

/**
 * Game
 *
 * Hoola
 *
 */
export class Game {
  #loop = null
  #pipeline = null
  #systems = null
  #canvas = null
  #input = null
  #audio = null
  #sound = null
  #music = null
  #frameCounter = null
  #viewport = null
  #scheduler = null
  #resources = null
  #runnable = new Runnable()

  /**
   * Constructor
   *
   * @param {HTMLCanvasElement|OffscreenCanvas} canvas
   * @param {GameOptions} [options]
   */
  constructor(canvas, options = {}) {
    if (options?.globalThis ?? true) {
      globalThis.game = this
    }
    this.#canvas = canvas
    this.#pipeline = [
      (currentTime) => this.#frameCounter.update(currentTime),
      () => this.#viewport.update(),
      () => this.#input.update(),
      () => this.#scheduler.update(),
    ]
    this.#loop = new Loop(this.#pipeline)
    this.#input = new Input()
    this.#audio = new Audio()
    this.#sound = new Sound(this.#audio)
    this.#music = new Music(this.#audio)
    this.#frameCounter = new FrameCounter()
    this.#viewport = new Viewport(this.#canvas)
    this.#scheduler = new Scheduler()
    this.#resources = new Resources(options?.baseURL ?? location.href)
    this.#systems = [
      this.#input,
      this.#audio,
      this.#viewport,
      this.#scheduler,
      this.#loop
    ]
  }

  /**
   *
   *
   * @type {boolean}
   */
  get isRunning() {
    return this.#runnable.isRunning
  }

  /**
   * @type {Loop}
   */
  get loop() {
    return this.#loop
  }

  get pipeline() {
    return this.#pipeline
  }

  get systems() {
    return this.#systems
  }

  get canvas() {
    return this.#canvas
  }

  get input() {
    return this.#input
  }

  get audio() {
    return this.#audio
  }

  get sound() {
    return this.#sound
  }

  get music() {
    return this.#music
  }

  get resources() {
    return this.#resources
  }

  get scheduler() {
    return this.#scheduler
  }

  get frameCounter() {
    return this.#frameCounter
  }

  get viewport() {
    return this.#viewport
  }

  /**
   * Starts the game.
   *
   * @returns {boolean}
   */
  start() {
    const result = this.#runnable.start()
    if (result) {
      this.#systems.forEach((system) => system.start?.())
    }
    return result
  }

  /**
   * Stops the game.
   *
   * @returns {boolean}
   */
  stop() {
    const result = this.#runnable.stop()
    if (result) {
      this.#systems.forEach((system) => system.stop?.())
    }
    return result
  }
}

export default Game
