import { Point } from '@taoro/math-point'

export class Ellipse {
  #position = new Point()
  #radii = new Point()

  constructor(x = 0, y = 0, a = 0, b = 0) {
    this.#position = new Point(x, y)
    this.#radii = new Point(a, b)
  }

  get position() {
    return this.#position
  }

  get radii() {
    return this.#radii
  }
}
