/**
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl
 * @param {ArrayBufferView} data
 * @param {number} target
 * @param {number} usage
 * @returns {WebGLBuffer}
 */
export function createBufferFrom(gl, data, target = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW) {
  const buffer = gl.createBuffer()
  gl.bindBuffer(target, buffer)
  gl.bufferData(target, data, usage)
  gl.bindBuffer(target, null)
  return buffer
}

/**
 * Creates a new ARRAY_BUFFER. Also called Vertex Buffer.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl
 * @param {ArrayBufferView} data
 * @param {number} usage
 * @returns {WebGLBuffer}
 */
export function createArrayBufferFrom(gl, data, usage = gl.STATIC_DRAW) {
  return createBufferFrom(gl, data, gl.ARRAY_BUFFER, usage)
}


/**
 * Creates a new ELEMENT_ARRAY_BUFFER. Also called Index Buffer.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl
 * @param {ArrayBufferView} data
 * @param {number} usage
 * @returns {WebGLBuffer}
 */
export function createElementArrayBufferFrom(gl, data, usage = gl.STATIC_DRAW) {
  return createBufferFrom(gl, data, gl.ELEMENT_ARRAY_BUFFER, usage)
}

export default {
  createBufferFrom,
  createArrayBufferFrom,
  createElementArrayBufferFrom,
}
