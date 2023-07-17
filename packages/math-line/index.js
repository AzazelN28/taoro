import { linear } from '@taoro/math-interpolation'
import { Scalar } from '@taoro/math-scalar'
import { Point } from '@taoro/math-point'

export class Line {
  static create(sx = 0, sy = 0, ex = 0, ey = 0) {
    return new Line(sx, sy, ex, ey)
  }

  #start = new Point()
  #end = new Point()

  constructor(sx = 0, sy = 0, ex = 0, ey = 0) {
    this.#start.set(sx, sy)
    this.#end.set(ex, ey)
  }

  get length() {
    return Math.hypot(this.width, this.height)
  }

  get lengthSquared() {
    return this.width * this.width + this.height * this.height
  }

  get start() {
    return this.#start
  }

  get end() {
    return this.#end
  }

  get width() {
    return this.start.x - this.end.x
  }

  get height() {
    return this.start.y - this.end.y
  }

  sideOfPoint({ x, y }) {
    const { start: { x: sx, y: sy}, end: { x: ex, y: ey} } = this
    return (ex - sx) * (y - sy) - (ey - sy) * (x - sx)
  }

  distanceToPoint({ x, y }) {
    return this.sideOfPoint({ x, y }) / this.length
  }

  projectionOfPoint({ x, y }) {
    const { start: { x: sx, y: sy }, width: dx, height: dy, lengthSquared } = this
    const dot = (x - sx) * dx + (y - sy) * dy
    let param = -1
    if (lengthSquared != 0) {
      param = dot / lengthSquared
    }
    return param
  }

  projectedPoint({ x, y }, { min = -0.25, max = 1.25 } = {}) {
    const param = this.projection({ x, y })
    return param >= min && param <= max
  }

  denominator(a, b) {
    // return (ax - bx) * (cy - dy) - (ay - by) * (cx - dx)
    return a.dx * b.dy - a.dy * b.dx
  }

  intersection(a, b, out = new Point()) {
    const denom = this.denominator(a, b)
    if (Scalar.areAlmostEqual(denom, 0)) {
      return out.set(Infinity, Infinity)
    }

    const { sx: ax, sy: ay, ex: bx, ey: by } = a
    const { sx: cx, sy: cy, ex: dx, ey: dy } = b

    const u = ((ax - cx) * (cy - dy) - (ay - cy) * (cx - dx)) / denom
    const v = ((ax - cx) * (ay - by) - (ay - cy) * (ax - bx)) / denom

    if (Number.isFinite(u) && Scalar.isBetween(u, 0, 1)) {
      return out.set(
        linear(u, ax, bx),
        linear(u, ay, by)
      )
    } else if (Number.isFinite(v) && Scalar.isBetween(v, 0, 1)) {
      return out.set(
        linear(v, cx, dx),
        linear(v, cy, dy)
      )
    }
    return out.set(Infinity, Infinity)
  }

  toFixed(fractionDigits = 0) {
    return `Line(${this.start.toFixed(fractionDigits)}, ${this.end.toFixed(fractionDigits)})`
  }

  toString() {
    return `Line(${this.start.x}, ${this.start.y}, ${this.end.x}, ${this.end.y})`
  }

  toArray() {
    return [[this.start.x, this.start.y], [this.end.x, this.end.y]]
  }

  toJSON() {
    return {
      start: this.start.toJSON(),
      end: this.end.toJSON()
    }
  }
}

export default Line
