import { isCanvas } from '@taoro/canvas'
import { Rect } from '@taoro/math-rect'
import { Point } from '@taoro/math-point'

/**
 * Rect of an image in an image sheet.
 *
 * It keeps the position and size of the image in the image sheet
 * and the rotation of the image.
 */
export class ImageSheetRect {
  #rect = null
  #pivot = null
  #rotation = 0

  constructor(x, y, width, height, pivotX = 0, pivotY = 0, rotation = 0) {
    this.#rect = new Rect(x, y, width, height)
    this.#pivot = new Point(pivotX ?? 0, pivotY ?? 0)
    this.#rotation = rotation ?? 0 
  }

  get pivot() {
    return this.#pivot
  }

  get rect() {
    return this.#rect
  }

  get rotation() {
    return this.#rotation
  }
}

/**
 * Image sheet.
 */
export class ImageSheet {
  static computeRectsFrom(width, height, options) {
    let subWidth = (Number.isFinite(options.subWidth)) ? options.subWidth : undefined
    let subHeight = (Number.isFinite(options.subHeight)) ? options.subHeight : undefined
    let columns = (Number.isFinite(options.columns)) ? options.columns : undefined
    let rows = (Number.isFinite(options.rows)) ? options.rows : undefined

    if (!subWidth && !subHeight && !columns && !rows) {
      throw new Error('Invalid options')
    }

    if (columns && !rows) {
      rows = 1
    } else if (rows && !columns) {
      columns = 1
    } else if (!columns && !rows) {
      columns = Math.floor(width / (subWidth ?? width))
      rows = Math.floor(height / (subHeight ?? height))
    }

    if (subWidth && !subHeight) {
      subHeight = Math.floor(height / rows)
    } else if (subHeight && !subWidth) {
      subWidth = Math.floor(width / columns)
    } else if (!subWidth && !subHeight) {
      subWidth = Math.floor(width / columns)
      subHeight = Math.floor(height / rows)
    }

    const rects = []
    for (let row = 0; row < rows; ++row) {
      for (let column = 0; column < columns; ++column) {
        rects.push(
          new ImageSheetRect(
            column * subWidth,
            row * subHeight,
            subWidth,
            subHeight
          )
        )
      }
    }
    return rects
  }

  static fromSize(width, height, options) {
    return new ImageSheet(
      width,
      height,
      ImageSheet.computeRectsFrom(width, height, options)
    )
  }

  static from(source, options) {
    if (source instanceof ImageBitmap || isCanvas(source)) {
      return ImageSheet.fromSize(source.width, source.height, options)
    } else if (source instanceof HTMLImageElement) {
      return ImageSheet.fromImage(source, options)
    } else {
      throw new Error('Invalid source')
    }
  }

  static isRects(rects) {
    if (!Array.isArray(rects))
      return false

    if (!rects.every((rect) => rect instanceof ImageSheetRect))
      return false

    return true
  }

  #width = 0
  #height = 0
  #rects = [] 

  constructor(width, height, rects) {
    if (!Number.isInteger(width) || !Number.isInteger(height)) {
      throw new Error('Invalid source size')
    }
    if (!rects) {
      throw new Error('Invalid rects')
    }
    this.#width = width
    this.#height = height
    this.#rects = rects
  }

  get width() {
    return this.#width
  }

  get height() {
    return this.#height
  }

  positionOf(index) {
    return this.rectOf(index)?.position ?? null
  }

  pivotOf(index) {
    return this.rectOf(index)?.pivot ?? null
  }

  rectOf(index) {
    return this.#rects.at(index) ?? null
  }
}

export default ImageSheet
