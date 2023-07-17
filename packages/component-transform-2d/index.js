import { Component }  from '@taoro/component'
import { Point } from '@taoro/math-point'
import { Matrix } from '@taoro/math-matrix-2d'

export class TransformComponent extends Component {
  #position = new Point()
  #scale = new Point(1, 1)
  #skew = new Point()
  rotation = 0
  #matrix = new Matrix()

  constructor(id, { x = 0, y = 0, rotation = 0, scaleX = 1, scaleY = 1, skewX = 0, skewY = 0 } = {}) {
    super(id)
    this.#position.set(x ?? 0, y ?? 0)
    this.rotation = rotation ?? 0
    this.#scale.set(scaleX ?? 1, scaleY ?? 1)
    this.#skew.set(skewX ?? 0, skewY ?? 0)
  }

  get position() {
    return this.#position
  }

  get scale() {
    return this.#scale
  }

  get skew() {
    return this.#skew
  }

  updateMatrix() {
    this.#matrix.translate(this.#position.x, this.#position.y)
    this.#matrix.rotate(this.rotation)
    this.#matrix.scale(this.#scale.x, this.#scale.y)
    this.#matrix.skew(this.#skew.x, this.#skew.y)
  }
}

export default TransformComponent
