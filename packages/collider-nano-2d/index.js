import { Rect } from '@taoro/math-rect'
import { Component } from '@taoro/component'
import { TransformComponent } from '@taoro/component-transform-2d'

export class ColliderComponent extends Component {
  #rect = null
  #collisions = new Set()

  constructor(id, { tag = 0, collidesWithTag = 0, rect = new Rect() } = {}) {
    super(id)
    this.#rect = rect ?? new Rect()
    this.tag = tag ?? 0
    this.collidesWithTag = collidesWithTag ?? 0
  }

  get collisions() {
    return this.#collisions
  }

  get rect() {
    return this.#rect
  }

  get hasCollided() {
    return this.#collisions.size > 0
  }

  collidesWith(id) {
    return this.#collisions.has(id)
  }
}

/**
 * A very simple collider system without any optimizations like
 * Spatial Hash Maps, Quad Trees, Bounding Volume Hierarchy, etc.
 *
 * It also doesn't supports rotation, scale, skew, etc. neither
 * it supports any kind of collider shape other than rectangles.
 *
 * It's just a simple collider system to get things started.
 */
export class Collider {
  update() {
    const aRect = new Rect()
    const bRect = new Rect()

    const components = Component.findByConstructor(ColliderComponent)
    if (!components) {
      return
    }

    for (const component of components) {
      component.collisions.clear()
    }

    for (let aIndex = 0; aIndex < components.length - 1; aIndex++) {
      const a = components[aIndex]
      const aTransform = Component.findByIdAndConstructor(a.id, TransformComponent)
      for (let bIndex = aIndex + 1; bIndex < components.length; bIndex++) {
        const b = components[bIndex]
        if (a.collidesWithTag !== b.tag) {
          continue
        }

        aRect
          .copy(a.rect)
          .translatePoint(aTransform.position)

        const bTransform = Component.findByIdAndConstructor(b.id, TransformComponent)
        bRect
          .copy(b.rect)
          .translatePoint(bTransform.position)

        if (aRect.intersectsRect(bRect)) {
          a.collisions.add(b.id)
          b.collisions.add(a.id)
        }
      }
    }
  }
}
