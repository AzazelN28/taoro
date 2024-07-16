/**
 * @typedef {Object} VertexArrayObjectAttributeDescriptor
 * @property {GLuint} location
 * @property {GLint} size
 * @property {GLenum} type
 * @property {GLboolean} [normalized=false]
 * @property {GLsizei} [stride]
 * @property {GLintptr} [offset]
 */

/**
 * @typedef {Object} VertexArrayObjectDescriptor
 * @property {Array<VertexArrayObjectAttributeDescriptor>} attributes
 * @property {WebGLBuffer} [indexBuffer]
 */

/**
 * Creates a new Vertex Array Object.
 *
 * @param {WebGL2RenderingContext} gl
 * @param {VertexArrayObjectDescriptor} vertexArrayBufferDescriptor
 * @returns {WebGLVertexArrayObject}
 */
export function createVertexArray(gl, vertexArrayBufferDescriptor) {
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  for (const attribute of vertexArrayBufferDescriptor.attributes) {
    gl.enableVertexAttribArray(attribute.location)
    gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer)
    gl.vertexAttribPointer(
      attribute.location,
      attribute.size,
      attribute.type,
      attribute?.normalized ?? gl.FALSE,
      attribute?.stride ?? 0,
      attribute?.offset ?? 0
    )
  }
  if (vertexArrayBufferDescriptor?.indexBuffer) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  }
  gl.bindVertexArray(null);
  return vao
}

export default {
  createVertexArray
}
