import { Component } from '@taoro/component'
import { Vector3 } from '@taoro/math-vector3'

export class TransformComponent extends Component {
  constructor(id) {
    super(id)
    this.position = new Vector3()
    this.rotation = new Vector3()
    this.scale = new Vector3(1, 1, 1)
    this.forward = new Vector3(1, 0, 0)
    this.up = new Vector3(0, 1, 0)
  }
}
