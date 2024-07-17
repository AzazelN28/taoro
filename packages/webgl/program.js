import { createFragmentShader, createVertexShader } from './shader'

/**
 * Creates a new program.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 * @returns {WebGLProgram}
 */
export function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program))
  }
  return program
}

/**
 * Creates a new program from its sources.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl
 * @param {string} vertexShaderSource
 * @param {string} fragmentShaderSource
 * @returns {WebGLProgram}
 */
export function createProgramFromSources(gl, vertexShaderSource, fragmentShaderSource) {
  return createProgram(
    gl,
    createVertexShader(gl, vertexShaderSource),
    createFragmentShader(gl, fragmentShaderSource)
  )
}

/**
 * Retuns all the program uniforms as an object.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 * @returns {Object.<string, >}
 */
export function getProgramUniforms(gl, program) {
  const uniforms = {}
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i)
    const location = gl.getUniformLocation(program, info.name)
    uniforms[info.name] = { info, location }
  }
  return uniforms
}

/**
 * Returns all the program attributes.
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 * @returns {Object.<string, *>}
 */
export function getProgramAttributes(gl, program) {
  const attributes = {}
  const count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveAttrib(program, i)
    const location = gl.getAttribLocation(program, info.name)
    attributes[info.name] = { info, location }
  }
  return attributes
}

/**
 * Returns
 *
 * @param {WebGLRenderingContext|WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 * @returns {{attributes, uniforms}}
 */
export function getProgramAttributesAndUniforms(gl, program) {
  return {
    attributes: getProgramAttributes(gl, program),
    uniforms: getProgramUniforms(gl, program),
  }
}

export default {
  createProgram,
  createProgramFromSources,
  getProgramAttributes,
  getProgramUniforms,
  getProgramAttributesAndUniforms,
}
