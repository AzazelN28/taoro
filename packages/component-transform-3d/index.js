import { Component } from '@taoro/component'
import { Matrix4 } from '@taoro/math-matrix4'
import { Vector3 } from '@taoro/math-vector3'

export class TransformComponent extends Component {
  #position = new Vector3()
  #rotation = new Vector3()

  #scale = new Vector3(Float32Array, 1, 1, 1)
  #forward = new Vector3(Float32Array, 0, 0, 1)
  #up = new Vector3(Float32Array, 0, 1, 0)

  #matrix = new Matrix4()
  #concatenatedMatrix = new Matrix4()

  /**
   * Matrix with local transformations.
   *
   * @type {Matrix4}
   */
  #localTransform = new Matrix4()

  /**
   * Matrix with chained transformations.
   *
   * @type {Matrix4}
   */
  #worldTransform = new Matrix4()

  /**
   * @type {TransformComponent}
   */
  #parent = null

  constructor(id) {
    super(id)
    this.#position = new Vector3()
    this.#rotation = new Vector3()
    this.#scale = new Vector3(Float32Array, 1, 1, 1)
    this.#forward = new Vector3(Float32Array, 1, 0, 0)
    this.#up = new Vector3(Float32Array, 0, 1, 0)
    this.#matrix = new Matrix4()
    this.#concatenatedMatrix = new Matrix4()
  }

  get position() {
    return this.#position
  }

  get rotation() {
    return this.#rotation
  }

  get scale() {
    return this.#scale
  }

  get forward() {
    return this.#forward
  }

  get up() {
    return this.#up
  }

  get matrix() {
    return this.#matrix
  }

  get concatenatedMatrix() {
    return this.#concatenatedMatrix
  }
}
