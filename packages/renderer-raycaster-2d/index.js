import { Point } from '@taoro/math-point'
import { Component } from '@taoro/component'
import { TransformComponent } from '@taoro/component-transform-2d'

export const RaySide = {
  NONE: 0,
  X: 1,
  Y: 2,
  OUTSIDE: 3
}

export class Level {
  #width = 0
  #height = 0
  #data = null

  constructor(width, height, data) {
    this.#width = width
    this.#height = height
    this.#data = data
  }

  get width() {
    return this.#width
  }

  get height() {
    return this.#height
  }

  get data() {
    return this.#data
  }
}

export class Ray {
  constructor() {
    this.visited = new Set()
    this.direction = new Point()
    this.position = new Point()
    this.tile = new Point()
    this.step = new Point()
    this.sideDist = new Point()
    this.deltaDist = new Point()
    this.side = RaySide.NONE
    this.distance = Infinity
    this.data = 0
    this.x = 0
    this.hit = false
  }

  updateFromCamera(camera) {
    this.position.copy(camera.position)
    this.visited.clear()
    return this
  }

  cast(level, camera, x) {
    this.hit = false
    this.side = RaySide.NONE
    this.data = 0

    this.tile.copy(camera.tile)
    this.direction.copy(camera.direction).addScaled(camera.plane, x)
    this.visited.add(this.tile.y * level.width + this.tile.x)

    this.deltaDist.set(
      Math.abs(1 / this.direction.x),
      Math.abs(1 / this.direction.y)
    )

    if (this.direction.x < 0) {
      this.sideDist.x = (this.position.x - this.tile.x) * this.deltaDist.x
      this.step.x = -1
    } else {
      this.sideDist.x = (this.tile.x + 1.0 - this.position.x) * this.deltaDist.x
      this.step.x = 1
    }

    if (this.direction.y < 0) {
      this.sideDist.y = (this.position.y - this.tile.y) * this.deltaDist.y
      this.step.y = -1
    } else {
      this.sideDist.y = (this.tile.y + 1.0 - this.position.y) * this.deltaDist.y
      this.step.y = 1
    }

    while (!this.hit) {
      if (this.sideDist.x < this.sideDist.y) {
        this.sideDist.x += this.deltaDist.x
        this.tile.x += this.step.x
        this.side = RaySide.X
      } else {
        this.sideDist.y += this.deltaDist.y
        this.tile.y += this.step.y
        this.side = RaySide.Y
      }

      const { x, y } = this.tile
      if (x < 0 || x >= level.width || y < 0 || y >= level.height) {
        this.hit = true
        this.side = RaySide.OUTSIDE
        this.data = 0
        break
      }

      const offset = y * level.width + x
      this.visited.add(offset)
      if (level.data[offset] != 0) {
        this.hit = true
        this.data = level.data[offset]
        break
      }
    }

    if (this.side === RaySide.X) {
      this.distance = this.sideDist.x - this.deltaDist.x
      this.x = this.position.y + this.distance * this.direction.y
    } else if (this.side === RaySide.Y) {
      this.distance = this.sideDist.y - this.deltaDist.y
      this.x = this.position.x + this.distance * this.direction.x
    } else {
      this.distance = Infinity
    }
    this.x -= Math.floor(this.x)
    return this
  }
}

export class CameraComponent extends Component {
  constructor(id, { fieldOfView = 0.66 } = {}) {
    super(id)
    this.size = new Point(320, 200)
    this.position = new Point()
    this.tile = new Point()
    this.direction = new Point()
    this.strafe = new Point()
    this.halfSize = new Point(this.size.x / 2, this.size.y / 2)
    this.fieldOfView = fieldOfView
    this.plane = new Point(0, fieldOfView)
    this.start = new Point(1, -fieldOfView)
    this.end = new Point(-1, fieldOfView)
    this.invDet = Infinity
  }
}

export class SpriteComponent extends Component {
  constructor(id, { texture = null, width = 0, height = 0, pivot = null } = {}) {
    super(id)
    this.texture = texture
    this.width = width
    this.height = height
    this.pivot = pivot ?? new Point()
  }
}

export class Renderer {
  #canvas = null
  #context = null
  #ray = new Ray()

  constructor(canvas, options) {
    this.#canvas = canvas
    this.#context = canvas.getContext('2d')
    this.clear = options?.clear ?? true
    this.level = options?.level ?? null
  }

  get canvas() {
    return this.#canvas
  }

  get context() {
    return this.#context
  }

  update() {
    if (this.clear) {
      this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
    }

    // Update the cameras first.
    const cameras = Component.findByConstructor(CameraComponent)
    for (const camera of cameras) {
      const transform = Component.findByIdAndConstructor(camera.id, TransformComponent)
      if (!transform) {
        continue
      }
      camera.direction.polar(transform.rotation, 1.0)
      camera.strafe.copy(camera.direction).perpLeft()
      camera.position.copy(transform.position)
      camera.tile.copy(camera.position).floor()
      camera.plane.copy(camera.strafe).scale(camera.fieldOfView)
      camera.start.copy(camera.direction).subtract(camera.plane)
      camera.end.copy(camera.direction).add(camera.plane)
      camera.invDet = 1.0 / camera.plane.cross(camera.direction)
    }

    // Update the sprites.
    const sprites = Component.findByConstructor(SpriteComponent)
    if (sprites) {
      for (const sprite of sprites) {

      }
    }

    this.#context.fillStyle = '#888'
    this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height / 2)

    this.#context.fillStyle = '#666'
    this.#context.fillRect(0, this.#canvas.height / 2, this.#canvas.width, this.#canvas.height / 2)

    const imageData = this.#context.getImageData(0, 0, this.#canvas.width, this.#canvas.height)

    // Render the cameras.
    const width = this.#canvas.width
    const height = this.#canvas.height
    const halfHeight = height / 2
    const colors = [
      '#f00',
      '#700',
      '#0f0',
      '#070',
      '#00f',
      '#007',
      '#ff0',
      '#770',
      '#f0f',
      '#707',
      '#0ff',
      '#077',
      '#fff',
      '#777',
      '#f70',
      '#730',
      '#f07',
      '#703',
      '#70f',
      '#307',
      '#0f7',
      '#073',
      '#07f',
      '#037'
    ]

    for (const camera of cameras) {
      // Limpiamos el set.
      this.#ray.updateFromCamera(camera)

      // Renderizamos cada columna.
      for (let x = 0; x < width; x++) {
        this.#ray.cast(this.level, camera, (x / width) * 2 - 1)
        if (this.#ray.side === RaySide.OUTSIDE) {
          continue
        }

        const columnHeight = Math.floor(height / this.#ray.distance)
        const columnHalfHeight = columnHeight >> 1

        const texNum = this.#ray.data - 1

        const drawStartY = Math.min(
          Math.max(0, Math.floor(-columnHalfHeight + halfHeight)),
          halfHeight
        )
        const drawEndY = Math.min(
          Math.max(halfHeight, Math.floor(columnHalfHeight + halfHeight)),
          height
        )

        const drawHeight = drawEndY - drawStartY

        for (let y = drawStartY; y < drawEndY; y++) {
          const offset = (y * this.#canvas.width + x) * 4
          imageData.data[offset + 0] = this.#ray.side === RaySide.X ? 0xff : 0x77
          imageData.data[offset + 1] = 0x00
          imageData.data[offset + 2] = 0x00
          imageData.data[offset + 3] = 0xff

          /*
          this.#context.fillStyle =
            this.#ray.side === RaySide.X
              ? colors[texNum * 2]
              : colors[texNum * 2 + 1]
          this.#context.fillRect(x, y, 1, 1)
          */
        }
      }

      // TODO: Renderizar sprites

      this.#context.putImageData(imageData, 0, 0)
    }
  }
}
