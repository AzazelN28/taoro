import { Rect } from '@taoro/math-rect'
import { Pool } from '@taoro/pool'
import { Component } from '@taoro/component'
import { TransformComponent } from '@taoro/component-transform-2d'

export class Collision {
  #target = null
  #source = null
  #targetRect = null
  #sourceRect = null

  /**
   * Creates a new collision identifier.
   *
   * @param {ColliderComponent} target
   * @param {ColliderComponent} source
   * @param {Rect} [targetRect=new Rect()]
   * @param {Rect} [sourceRect=new Rect()]
   */
  constructor(target, source, targetRect = new Rect(), sourceRect = new Rect()) {
    this.#target = target
    this.#source = source
    this.#targetRect = targetRect?.clone?.() ?? new Rect()
    this.#sourceRect = sourceRect?.clone?.() ?? new Rect()
  }

  get target() {
    return this.#target
  }

  get source() {
    return this.#source
  }

  get targetRect() {
    return this.#targetRect
  }

  get sourceRect() {
    return this.#sourceRect
  }

  set(target, source, targetRect, sourceRect) {
    this.#target = target
    this.#source = source
    this.#targetRect.copy(targetRect)
    this.#sourceRect.copy(sourceRect)
    return this
  }
}

/**
 * Options for the collider component.
 *
 * @typedef {Object} ColliderComponentOptions
 * @property {string|number} [tag=0]
 * @property {string|number} [target=0]
 * @property {Array<Rect>} [rects=[new Rect()]]
 */

/**
 * A collider component to hold collisions.
 */
export class ColliderComponent extends Component {
  #rects = null
  #collisions = new Set()

  /**
   * Creates a new collider component.
   *
   * @param {string|number} id
   * @param {ColliderComponentOptions} [options]
   */
  constructor(id, { tag = 0, target = 0, rects = [new Rect()] } = {}) {
    super(id)
    this.#rects = rects ?? [new Rect()]
    this.tag = tag ?? 0
    this.target = target ?? 0
  }

  get collisions() {
    return this.#collisions
  }

  get rects() {
    return this.#rects
  }

  get hasCollided() {
    return this.#collisions.size > 0
  }

  collidesWithTag(tag) {
    for (const collision of this.#collisions) {
      if (collision.target.tag === tag) {
        return true
      }
    }
    return false
  }

  collidesWithId(id) {
    for (const collision of this.#collisions) {
      if (collision.target.id === id) {
        return true
      }
    }
    return false
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
  #maxCollisions = Infinity
  #collisionPool = null

  constructor(options) {
    this.#maxCollisions = options?.maxCollisions ?? Infinity
    if (Number.isFinite(this.#maxCollisions)) {
      this.#collisionPool = new Pool(this.#maxCollisions, () => new Collision(null, null))
    }
  }

  update() {
    const aRect = new Rect()
    const bRect = new Rect()

    const components = Component.findByConstructor(ColliderComponent)
    if (!components) {
      return
    }

    for (const component of components) {
      if (this.#collisionPool) {
        this.#collisionPool.deallocateAll(component.collisions)
      }
      component.collisions.clear()
    }

    for (let aIndex = 0; aIndex < components.length - 1; aIndex++) {
      const a = components[aIndex]
      const aTransform = Component.findByIdAndConstructor(a.id, TransformComponent)
      for (let bIndex = aIndex + 1; bIndex < components.length; bIndex++) {
        const b = components[bIndex]
        if (a.target !== b.tag) {
          continue
        }

        for (const aCurrentRect of a.rects) {
          aRect
            .copy(aCurrentRect)
            .translatePoint(aTransform.position)

          for (const bCurrentRect of b.rects) {
            const bTransform = Component.findByIdAndConstructor(b.id, TransformComponent)
            bRect
              .copy(bCurrentRect)
              .translatePoint(bTransform.position)

            if (aRect.intersectsRect(bRect)) {
              // TODO: This creates a new collision object every time, we should reuse
              // them instead.
              if (this.#collisionPool) {
                const aCollision = this.#collisionPool.allocate()
                const bCollision = this.#collisionPool.allocate()
                if (aCollision && bCollision) {
                  a.collisions.add(aCollision.set(b, a, bRect, aRect))
                  b.collisions.add(bCollision.set(a, b, aRect, bRect))
                }
              } else {
                a.collisions.add(new Collision(b, a, bRect, aRect))
                b.collisions.add(new Collision(a, b, aRect, bRect))
              }
            }
          }
        }
      }
    }
  }
}
