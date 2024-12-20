import { Point } from '@taoro/math-point'

export class Triangle {
  #a = new Point()
  #b = new Point()
  #c = new Point()

  constructor(a = new Point(), b = new Point(), c = new Point()) {
    this.#a = a
    this.#b = b
    this.#c = c
  }

  get a() { return this.#a }
  get b() { return this.#b }
  get c() { return this.#c }
}

export default Triangle
