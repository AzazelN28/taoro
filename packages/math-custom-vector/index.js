/**
 * Defines a new vector class.
 *
 * @param {string} name
 * @param {*} defaultValues
 * @returns {CustomVector}
 */
export function defineVector(name, defaultValues) {
  const $names = Object.keys(defaultValues)
  const $values = Object.values(defaultValues)
  const $symbol = Symbol(name)

  const CustomVector = class {
    [$symbol]

    /**
     *
     * @param {*} instance
     * @returns {boolean}
     */
    static [Symbol.hasInstance](instance) {
      return $symbol in instance
    }

    static create(...args) {
      const instance = new this()
      instance.set(...args)
      return instance
    }

    constructor(initialValues = {}) {
      for (const name of $names) {
        this[name] = initialValues[name] ?? defaultValues[name]
      }
    }

    get length() {
      return Math.hypot(...Object.values(this))
    }

    get lengthSquared() {
      return this.dot(this)
    }

    set(...args) {
      if (args.length === 0) return this

      for (let index = 0; index < $names.length; index++) {
        const name = $names[index]
        this[name] = args[index] ?? $values[index]
      }
      return this
    }

    copy(vector) {
      if (!($symbol in vector)) {
        throw new Error(`Expected a ${name} instance.`)
      }
      for (const name of Object.keys(vector)) {
        this[name] = vector[name] ?? defaultValues[name]
      }
      return this
    }

    clone() {
      return new Vector(this)
    }

    reset() {
      for (const name of $names) {
        this[name] = defaultValues[name]
      }
    }

    add(vector) {
      if (!($symbol in vector)) {
        throw new Error(`Expected a ${name} instance.`)
      }
      for (const name of $names) {
        this[name] += vector[name]
      }
      return this
    }

    subtract(vector) {
      if (!($symbol in vector)) {
        throw new Error(`Expected a ${name} instance.`)
      }
      for (const name of $names) {
        this[name] -= vector[name]
      }
      return this
    }

    multiply(vector) {
      if (!($symbol in vector)) {
        throw new Error(`Expected a ${name} instance.`)
      }
      for (const name of $names) {
        this[name] *= vector[name]
      }
      return this
    }

    divide(vector) {
      if (!($symbol in vector)) {
        throw new Error(`Expected a ${name} instance.`)
      }
      for (const name of $names) {
        this[name] /= vector[name]
      }
      return this
    }

    scale(scalar) {
      if (!Number.isNaN(scalar)) {
        throw new Error(`Expected a number.`)
      }
      for (const name of $names) {
        this[name] *= scalar
      }
      return this
    }

    negate() {
      for (const name of $names) {
        this[name] = -this[name]
      }
      return this
    }

    normalize() {
      const length = this.length
      if (length === 0) return this
      return this.scale(1 / length)
    }

    dot(vector) {
      if (!($symbol in vector)) {
        throw new Error(`Expected a ${name} instance.`)
      }
      let result = 0
      for (const name of $names) {
        result += this[name] * vector[name]
      }
      return result
    }

    distanceSquared(vector) {
      if (!($symbol in vector)) {
        throw new Error(`Expected a ${name} instance.`)
      }
      let result = 0
      for (const name of $names) {
        result += (this[name] - vector[name]) ** 2
      }
      return result
    }

    distance(vector) {
      return Math.sqrt(this.distanceSquared(vector))
    }

    greaterThan(vector) {
      if (!($symbol in vector)) {
        throw new Error(`Expected a ${name} instance.`)
      }
      for (const name of $names) {
        if (this[name] <= vector[name]) return false
      }
      return true
    }

    lessThan(vector) {
      if (!($symbol in vector)) {
        throw new Error(`Expected a ${name} instance.`)
      }
      for (const name of $names) {
        if (this[name] >= vector[name]) return false
      }
      return true
    }

    equalTo(vector) {
      if (!($symbol in vector)) {
        throw new Error(`Expected a ${name} instance.`)
      }
      for (const name of $names) {
        if (this[name] !== vector[name]) return false
      }
      return true
    }

    round() {
      for (const name of $names) {
        this[name] = Math.round(this[name])
      }
      return this
    }

    floor() {
      for (const name of $names) {
        this[name] = Math.floor(this[name])
      }
      return this
    }

    ceil() {
      for (const name of $names) {
        this[name] = Math.ceil(this[name])
      }
      return this
    }

    toFixed(fractionDigits = 0) {
      return `${name}(${Array.from(Object.values(this)).map(value => value.toFixed(fractionDigits)).join(', ')})`
    }

    toString() {
      return `${name}(${Object.values(this).join(', ')})`
    }

    get [Symbol.toStringTag]() {
      return name
    }

    *[Symbol.iterator]() {
      for (const name of $names) {
        yield this[name]
      }
    }
  }

  return CustomVector
}

export default defineVector
