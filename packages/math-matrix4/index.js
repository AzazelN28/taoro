import { Scalar } from '@taoro/math-scalar'
import mat4 from './mat4';

export class Matrix4 {
  static NUM_ROWS = 4
  static NUM_COLUMNS = 4
  static NUM_ELEMENTS = 16

  static M00 = 0
  static M01 = 1
  static M02 = 2
  static M03 = 3

  static M10 = 4
  static M11 = 5
  static M12 = 6
  static M13 = 7

  static M20 = 8
  static M21 = 9
  static M22 = 10
  static M23 = 11

  static M30 = 12
  static M31 = 13
  static M32 = 14
  static M33 = 15

  static identity(out) {
    return mat4.identity(out.rawData)
  }

  static invert(out, matrix) {
    return mat4.invert(out.rawData, matrix.rawData)
  }

  static multiply(out, a, b) {
    return mat4.multiply(out.rawData, a.rawData, b.rawData)
  }

  static perspective(out, fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);
    if (Number.isFinite(far)) {
      const nf = 1 / (near - far);
      return out.set(
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, 2 * far * near * nf, 0,
      )
    }
    return out.set(
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, -1, -1,
      0, 0, -2 * near, 0
    )
  }

  static rotateX(out, a, rad) {
    return mat4.rotateX(out.rawData, a.rawData, rad)
  }

  static rotateY(out, a, rad) {
    return mat4.rotateY(out.rawData, a.rawData, rad)
  }

  static rotateZ(out, a, rad) {
    return mat4.rotateZ(out.rawData, a.rawData, rad)
  }

  static translate(out, matrix, vector) {
    return mat4.translate(out.rawData, matrix.rawData, vector.rawData)
  }

  static setTranslation(out, vector) {
    out.rawData[12] = vector.x
    out.rawData[13] = vector.y
    out.rawData[14] = vector.z
    out.rawData[15] = 1
    return out
  }

  static scale(out, matrix, vector) {
    return mat4.scale(out.rawData, matrix.rawData, vector.rawData)
  }

  /**
   * Raw data.
   *
   * @type {Float32Array|Float64Array}
   */
  #rawData = null

  /**
   * Constructor
   *
   * @param {Float32Array|Float64Array} [rawData]
   */
  constructor(rawData = new Float32Array(Matrix4.NUM_ELEMENTS)) {
    this.#rawData = rawData ?? new Float32Array(Matrix4.NUM_ELEMENTS)
    if (this.#rawData.length !== Matrix4.NUM_ELEMENTS) {
      throw new TypeError('Invalid rawData')
    }
    this.identity()
  }

  get rawData() { return this.#rawData }

  get m00() { return this.#rawData[Matrix4.M00] }
  set m00(v) { this.#rawData[Matrix4.M00] = v }

  get m01() { return this.#rawData[Matrix4.M01] }
  set m01(v) { this.#rawData[Matrix4.M01] = v }

  get m02() { return this.#rawData[Matrix4.M02] }
  set m02(v) { this.#rawData[Matrix4.M02] = v }

  get m03() { return this.#rawData[Matrix4.M03] }
  set m03(v) { this.#rawData[Matrix4.M03] = v }

  get m10() { return this.#rawData[Matrix4.M10] }
  set m10(v) { this.#rawData[Matrix4.M10] = v }

  get m11() { return this.#rawData[Matrix4.M11] }
  set m11(v) { this.#rawData[Matrix4.M11] = v }

  get m12() { return this.#rawData[Matrix4.M12] }
  set m12(v) { this.#rawData[Matrix4.M12] = v }

  get m13() { return this.#rawData[Matrix4.M13] }
  set m13(v) { this.#rawData[Matrix4.M13] = v }

  get m20() { return this.#rawData[Matrix4.M20] }
  set m20(v) { this.#rawData[Matrix4.M20] = v }

  get m21() { return this.#rawData[Matrix4.M21] }
  set m21(v) { this.#rawData[Matrix4.M21] = v }

  get m22() { return this.#rawData[Matrix4.M22] }
  set m22(v) { this.#rawData[Matrix4.M22] = v }

  get m23() { return this.#rawData[Matrix4.M23] }
  set m23(v) { this.#rawData[Matrix4.M23] = v }

  get m30() { return this.#rawData[Matrix4.M30] }
  set m30(v) { this.#rawData[Matrix4.M30] = v }

  get m31() { return this.#rawData[Matrix4.M31] }
  set m31(v) { this.#rawData[Matrix4.M31] = v }

  get m32() { return this.#rawData[Matrix4.M32] }
  set m32(v) { this.#rawData[Matrix4.M32] = v }

  get m33() { return this.#rawData[Matrix4.M33] }
  set m33(v) { this.#rawData[Matrix4.M33] = v }

  get isIdentity() {
    return this.m00 === 1
        && this.m01 === 0
        && this.m02 === 0
        && this.m03 === 0

        && this.m10 === 0
        && this.m11 === 1
        && this.m12 === 0
        && this.m13 === 0

        && this.m20 === 0
        && this.m21 === 0
        && this.m22 === 1
        && this.m23 === 0

        && this.m30 === 0
        && this.m31 === 0
        && this.m32 === 0
        && this.m33 === 1
  }

  set(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    const a = [m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33]
    if (a.some((v) => !Number.isFinite(v))) {
      throw new Error('WHATEVER')
    }
    this.#rawData[Matrix4.M00] = m00;
    this.#rawData[Matrix4.M01] = m01;
    this.#rawData[Matrix4.M02] = m02;
    this.#rawData[Matrix4.M03] = m03;

    this.#rawData[Matrix4.M10] = m10;
    this.#rawData[Matrix4.M11] = m11;
    this.#rawData[Matrix4.M12] = m12;
    this.#rawData[Matrix4.M13] = m13;

    this.#rawData[Matrix4.M20] = m20;
    this.#rawData[Matrix4.M21] = m21;
    this.#rawData[Matrix4.M22] = m22;
    this.#rawData[Matrix4.M23] = m23;

    this.#rawData[Matrix4.M30] = m30;
    this.#rawData[Matrix4.M31] = m31;
    this.#rawData[Matrix4.M32] = m32;
    this.#rawData[Matrix4.M33] = m33;

    /*
    this.#rawData.set([
      m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33,
    ], 0)
    */
    return this
  }

  setRow(row, v0, v1, v2, v3) {
    if (row < 0 || row >= Matrix4.NUM_ROWS) {
      throw new RangeError('Invalid row index')
    }
    this.#rawData.set([v0, v1, v2, v3], row * 4)
    return this
  }

  setColumn(column, v0, v1, v2, v3) {
    if (column < 0 || column >= Matrix4.NUM_COLUMNS) {
      throw new RangeError('Invalid column index')
    }
    this.#rawData[column + 0] = v0
    this.#rawData[column + 4] = v1
    this.#rawData[column + 8] = v2
    this.#rawData[column + 12] = v3
    return this
  }

  setPosition(x, y, z) {
    return this.setRow(
      3,
      x, y, z, this.m33
    )
  }

  reset() {
    return this.set(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    )
  }

  identity() {
    return this.reset()
  }

  copy({ m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33 }) {
    return this.set(
      m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33,
    )
  }

  copyTranslation({ m30, m31, m32 }) {
    return this.#rawData.set([m30, m31, m32], 12)
  }

  clone() {
    const {
      m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33,
    } = this
    return new Matrix4(
      this.#rawData.constructor,
      m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33,
    )
  }

  perspective(fieldOfView, aspectRatio, near, far) {
    return Matrix4.perspective(this, fieldOfView, aspectRatio, near, far)
  }

  transform({ x, y, z, w }) {
    const xp = x * this.m00 + y * this.m10 + z * this.m20 * w * this.m30
    const yp = x * this.m01 + y * this.m11 + z * this.m21 * w * this.m31
    const zp = x * this.m02 + y * this.m12 + z * this.m22 * w * this.m32
    const wp = x * this.m03 + y * this.m13 + z * this.m23 * w * this.m33
    return new Vector4(xp, yp, zp, wp)
  }

  prepend(other) {
    return Matrix4.multiply(
      this, other, this
    )
  }

  append(other) {
    return Matrix4.multiply(
      this, this, other
    )
  }

  translate({ x, y, z }) {
    return this.setRow(3, x, y, z, this.#rawData[15])
  }
}

export default Matrix4
