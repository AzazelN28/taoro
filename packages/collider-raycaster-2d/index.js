import { Rect } from '@taoro/math-rect'
import { Point } from '@taoro/math-point'
import { Component } from '@taoro/component'
import { TransformComponent } from '@taoro/component-transform-2d'

/**
 *
 */
export class ColliderComponent extends Component {
  constructor(id, { radius = 0 }) {
    super(id)
    this.radius = radius
    this.movement = new Point()
    this.collides = false
    this.collisions = []
    this.nextPosition = new Point()
    this.nearestPoint = new Point()
    this.distanceToNearestPoint = new Point()
    this.distance = 0
  }
}

/**
 *
 */
export class Collider {
  #level = null

  constructor(options) {
    this.#level = options.level
  }

  update() {
    const components = Component.findByConstructor(ColliderComponent)
    if (!components) {
      return
    }

    for (let index = 0; index < components.length; index++) {
      const component = components[index]
      component.collides = false
      component.collisions.length = 0
    }

    for (let aIndex = 0; aIndex < components.length - 1; ++aIndex) {
      const a = components[aIndex]
      for (let bIndex = aIndex + 1; bIndex < components.length; ++bIndex) {
        const b = components[bIndex]

        const aTransform = Component.findByIdAndConstructor(a.id, TransformComponent)
        const bTransform = Component.findByIdAndConstructor(b.id, TransformComponent)

        const distance = aTransform.position.distanceTo(bTransform.position)
        if (distance <= a.radius + b.radius) {
          a.collides = true
          b.collides = true
          a.collisions.push(b.id)
          b.collisions.push(a.id)
        }
      }
    }

    const tileRect = new Rect(0, 0, 1, 1)
    for (const component of components) {
      if (component.radius <= 0) {
        continue
      }

      const transform = Component.findByIdAndConstructor(component.id, TransformComponent)

      // Reset collider component state.
      component.collides = false
      component.distance = 0
      component.distanceToNearestPoint.reset()
      component.nearestPoint.reset()
      component.nextPosition
        .copy(transform.position)
        .add(component.movement)

      const minx = Math.floor(component.nextPosition.x) - 1
      const miny = Math.floor(component.nextPosition.y) - 1
      const maxx = Math.floor(component.nextPosition.x) + 1
      const maxy = Math.floor(component.nextPosition.y) + 1

      for (let y = miny; y <= maxy; ++y) {
        const baseOffset = y * this.#level.width
        for (let x = minx; x <= maxx; ++x) {
          const offset = baseOffset + x
          const outOfLevel = x < 0 || x >= this.#level.width || y < 0 || y >= this.#level.height
          const tileId = outOfLevel ? 0xFF : this.#level.data[offset]
          if (tileId === 0) {
            continue
          }

          tileRect.setPosition(x, y)

          component.nearestPoint
            .set(component.nextPosition.x, component.nextPosition.y)
            .clamp(tileRect.leftTop, tileRect.rightBottom)

          component.distanceToNearestPoint
            .copy(component.nearestPoint)
            .subtract(component.nextPosition)

          component.distance = component.distanceToNearestPoint.length
          if (component.distance <= component.radius) {
            component.collides = true
            component.distanceToNearestPoint.polar(component.distanceToNearestPoint.angle, component.radius - component.distance)
            component.nextPosition.subtract(component.distanceToNearestPoint)
          }
        }
      }

      transform.position.copy(component.nextPosition)
    }
  }
}
