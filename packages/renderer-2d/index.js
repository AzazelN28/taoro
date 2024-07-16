import { TransformComponent } from '@taoro/component-transform-2d'
import { Component } from '@taoro/component'
import { Rect } from '@taoro/math-rect'
import { Point } from '@taoro/math-point'

/**
 * Global variable used to track if there are z-index changes so we need needs to sort elements.
 *
 * @type {boolean}
 */
let needsSort = false

export class ZIndexComponent extends Component {
  #zIndex = 0

  constructor(id, { alpha = 1, compositeOperation = 'source-over', zIndex = 0 } = {}) {
    super(id)
    Component.registerByConstructor(ZIndexComponent, this)
    this.alpha = alpha
    this.compositeOperation = compositeOperation
    this.#zIndex = zIndex
  }

  get zIndex() {
    return this.#zIndex
  }

  set zIndex(zIndex) {
    this.#zIndex = zIndex
    needsSort = true
  }
}

export class ImageComponent extends ZIndexComponent {
  #pivot = new Point()
  #rect = null

  constructor(id, { source, rect = null, pivot = null }) {
    super(id)
    this.source = source
    this.#rect = rect
    this.#pivot = pivot ?? new Point()
  }

  get rect() {
    return this.#rect
  }

  get pivot() {
    return this.#pivot
  }
}

export class TextComponent extends ZIndexComponent {
  #pivot = new Point()

  constructor(id, { text = '', textAlign = 'left', textBaseline = 'top', font = '16px monospace', fillStyle = '#fff', strokeStyle = null }) {
    super(id)
    this.font = font ?? '16px monospace'
    this.text = text ?? ''
    this.textAlign = textAlign ?? 'left'
    this.textBaseline = textBaseline ?? 'top'
    this.fillStyle = fillStyle ?? '#fff'
    this.strokeStyle = strokeStyle ?? null
  }

  get pivot() {
    return this.#pivot
  }
}

export class RectComponent extends ZIndexComponent {
  #rect = new Rect()

  constructor(id, { rect, fillStyle = '#fff', strokeStyle = null } = {}) {
    super(id)
    this.#rect = rect ?? new Rect()
    this.fillStyle = fillStyle ?? '#fff'
    this.strokeStyle = strokeStyle ?? null
  }

  get rect() {
    return this.#rect
  }
}

export class PathComponent extends ZIndexComponent {
  #path = null

  constructor(id, { path, fillStyle = '#fff', strokeStyle = null }) {
    super(id)
    this.#path = path ?? new Path2D()
    this.fillStyle = fillStyle ?? '#fff'
    this.strokeStyle = strokeStyle ?? null
  }

  get path() {
    return this.#path
  }
}

export class Renderer {
  /**
   * @type {HTMLCanvasElement|OffscreenCanvas}
   */
  #canvas = null

  /**
   * @type {WebGLRenderingContext|WebGL2RenderingContext}
   */
  #context = null

  /**
   * Constructor
   *
   * @param {HTMLCanvasElement|OffscreenCanvas} canvas
   * @param {*} options
   */
  constructor(canvas, options) {
    this.#canvas = canvas
    this.#context = canvas.getContext('2d')
    this.clear = options?.clear ?? true
  }

  get canvas() {
    return this.#canvas
  }

  get context() {
    return this.#context
  }

  #drawPre(component, transform) {
    this.#context.save()
    this.#context.translate(transform.position.x, transform.position.y)
    this.#context.rotate(transform.rotation)
    this.#context.scale(transform.scale.x, transform.scale.y)
    if (this.#context.globalAlpha !== component.alpha) {
      this.#context.globalAlpha = component.alpha
    }
    if (this.#context.globalCompositeOperation !== component.compositeOperation) {
      this.#context.globalCompositeOperation = component.compositeOperation
    }
  }

  #drawPost() {
    this.#context.restore()
  }

  #drawImage(component) {
    if (component.rect) {
      this.#context.drawImage(
        component.source,
        component.rect.x,
        component.rect.y,
        component.rect.width,
        component.rect.height,
        component.pivot.x,
        component.pivot.y,
        component.rect.width,
        component.rect.height
      )
    } else {
      this.#context.drawImage(
        component.source,
        component.pivot.x,
        component.pivot.y
      )
    }
  }

  #drawText(component) {
    if (this.#context.font !== component.font) {
      this.#context.font = component.font
    }
    if (this.#context.textAlign !== component.textAlign) {
      this.#context.textAlign = component.textAlign
    }
    if (this.#context.textBaseline !== component.textBaseline) {
      this.#context.textBaseline = component.textBaseline
    }
    let text = component.text
    if (component.fillStyle || component.strokeStyle) {
      if (typeof component.text === 'function') {
        text = component.text()
      }
    }
    if (this.#context.fillStyle !== component.fillStyle) {
      this.#context.fillStyle = component.fillStyle
    }
    if (component.fillStyle) {
      this.#context.fillText(text, component.pivot.x, component.pivot.y)
    }
    if (this.#context.strokeStyle !== component.strokeStyle) {
      this.#context.strokeStyle = component.strokeStyle
    }
    if (component.strokeStyle) {
      this.#context.strokeText(text, component.pivot.x, component.pivot.y)
    }
  }

  #drawRect(component) {
    if (this.#context.fillStyle !== component.fillStyle) {
      this.#context.fillStyle = component.fillStyle
    }
    if (component.fillStyle) {
      this.#context.fillRect(
        component.rect.x,
        component.rect.y,
        component.rect.width,
        component.rect.height
      )
    }
    if (this.#context.strokeStyle !== component.strokeStyle) {
      this.#context.strokeStyle = component.strokeStyle
    }
    if (component.strokeStyle) {
      this.#context.strokeRect(
        component.rect.x,
        component.rect.y,
        component.rect.width,
        component.rect.height
      )
    }
  }

  #drawPath(component) {
    if (this.#context.fillStyle !== component.fillStyle) {
      this.#context.fillStyle = component.fillStyle
    }
    if (component.fillStyle) {
      this.#context.fill(component.path)
    }
    if (this.#context.strokeStyle !== component.strokeStyle) {
      this.#context.strokeStyle = component.strokeStyle
    }
    if (component.strokeStyle) {
      this.#context.stroke(component.path)
    }
  }

  update() {
    if (this.clear) {
      this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
    }
    const components = Component.findByConstructor(ZIndexComponent)
    if (!components) {
      return
    }

    if (needsSort) {
      components.sort((a, b) => a.zIndex - b.zIndex)
      needsSort = false
    }
    for (const component of components) {
      const transform = Component.findByIdAndConstructor(component.id, TransformComponent)
      if (!transform) {
        continue
      }

      this.#drawPre(component, transform)
      if (component instanceof ImageComponent) {
        this.#drawImage(component)
      } else if (component instanceof TextComponent) {
        this.#drawText(component)
      } else if (component instanceof RectComponent) {
        this.#drawRect(component)
      } else if (component instanceof PathComponent) {
        this.#drawPath(component)
      }
      this.#drawPost()
    }
  }
}

export default Renderer
