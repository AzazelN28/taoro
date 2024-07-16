import './style.css'
import Game from '@taoro/game'
import WebGL from '@taoro/webgl'
import Matrix4 from '@taoro/math-matrix4'
import vertexShader from './shaders/vertex.glsl?raw'
import fragmentShader from './shaders/fragment.glsl?raw'

class Updatable {
  #needsUpdate = false

  constructor(needsUpdate = true) {
    this.#needsUpdate = needsUpdate
  }

  shouldUpdate() {
    this.#needsUpdate = true
    return this
  }

  updated() {
    this.#needsUpdate = false
    return this
  }

  get needsUpdate() {
    return this.#needsUpdate
  }
}

class PerspectiveProjection extends Updatable {
  /**
   * @type {number}
   */
  #fieldOfView = Math.PI * 0.5

  /**
   * @type {number}
   */
  #aspectRatio = 1

  /**
   * @type {number}
   */
  #near = 0.001

  /**
   * @type {number}
   */
  #far = 1000

  /**
   * @type {Matrix4}
   */
  #matrix = new Matrix4()

  constructor(
    fieldOfView = Math.PI * 0.5,
    aspectRatio = 1,
    near = 0.001,
    far = 1000
  ) {
    super()
    this.#fieldOfView = fieldOfView
    this.#aspectRatio = aspectRatio
    this.#near = near
    this.#far = far
  }

  get matrix() {
    if (this.needsUpdate) {
      Matrix4.perspective(
        this.#matrix,
        this.#fieldOfView,
        this.#aspectRatio,
        this.#near,
        this.#far
      )
      this.updated()
    }
    return this.#matrix
  }

  get fieldOfView() {
    return this.#fieldOfView
  }

  set fieldOfView(newFieldOfView) {
    this.#fieldOfView = newFieldOfView
    this.shouldUpdate()
  }

  get aspectRatio() {
    return this.#aspectRatio
  }

  set aspectRatio(newAspectRatio) {
    this.#aspectRatio = newAspectRatio
    this.shouldUpdate()
  }

  get near() {
    return this.#near
  }

  set near(newNear) {
    this.#near = newNear
    this.shouldUpdate()
  }

  get far() {
    return this.#far
  }

  set far(newFar) {
    this.#far = newFar
    this.shouldUpdate()
  }
}

class CameraComponent {
  #projection = null

  constructor(projection) {
    this.#projection = projection
  }

  get projection() {
    return this.#projection
  }
}

class CustomRenderer {
  #canvas = null

  /**
   * @type {WebGL2RenderingContext}
   */
  #gl = null

  /**
   * @type {WebGLProgram}
   */
  #program = null

  /**
   * @type {Map.<string, WebGLVertexArrayObject>}
   */
  #vaos = new Map()

  #camera = new CameraComponent(new PerspectiveProjection(
    Math.PI * 0.5,
    1,
    0.001,
    1000
  ))

  #projection = new Matrix4()
  #view = new Matrix4()
  #viewModel = new Matrix4()
  #model = new Matrix4()
  #modelView = new Matrix4()
  #modelViewProjection = new Matrix4()

  rotateX = 0
  rotateY = 0
  rotateZ = 0

  constructor(canvas) {
    this.#canvas = canvas
    const gl = this.#gl = canvas.getContext('webgl2')

    this.#program = WebGL.program.createProgramFromSources(
      gl,
      vertexShader,
      fragmentShader
    )

    this.#setupStarfield(gl)
    this.#setupOrbit(gl)
  }

  #setupStarfield(gl) {
    const vertices = new Array()
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 1000
      const y = (Math.random() - 0.5) * 1000
      const z = (Math.random() - 0.5) * 1000
      const l = Math.hypot(x, y, z)
      const w = 1 + Math.random() * 3
      vertices.push(x / l, y / l, z / l, w)
    }
    console.log(vertices)
    const data = new Float32Array(vertices)
    const buffer = WebGL.buffer.createArrayBufferFrom(gl, data)

    this.#vaos.set('starfield', WebGL.vao.createVertexArray(gl, {
      attributes: [{ index: 0, size: 4, type: gl.FLOAT, buffer }],
    }))
  }

  #setupOrbit(gl) {
    const vertices = new Array()
    for (let i = 0; i < 1000; i++) {
      const theta = i / 1000 * Math.PI * 2
      const x = Math.cos(theta) * 1000
      const y = 0
      const z = Math.sin(theta) * 1000
      const w = 1
      vertices.push(x, y, z, w)
    }
    const data = new Float32Array(vertices)
    const buffer = WebGL.buffer.createArrayBufferFrom(gl, data)

    this.#vaos.set('orbit', WebGL.vao.createVertexArray(gl, {
      attributes: [{ index: 0, size: 4, type: gl.FLOAT, buffer }],
    }))
  }

  update(game) {
    const gl = this.#gl

    const aspectRatio = this.#canvas.width / this.#canvas.height
    this.#camera.projection.aspectRatio = aspectRatio

    if (game.input.keyboard.isPressed('ArrowUp')) {
      this.rotateX += -0.0001
    } else if (game.input.keyboard.isPressed('ArrowDown')) {
      this.rotateX += 0.0001
    } else {
      this.rotateX *= 0.9
    }

    if (game.input.keyboard.isPressed('ArrowLeft')) {
      this.rotateZ += 0.0001
    } else if (game.input.keyboard.isPressed('ArrowRight')) {
      this.rotateZ += -0.0001
    } else {
      this.rotateZ *= 0.9
    }

    if (game.input.keyboard.isPressed('KeyA')) {
      this.rotateY += 0.0001
    } else if (game.input.keyboard.isPressed('KeyD')) {
      this.rotateY += -0.0001
    } else {
      this.rotateY *= 0.9
    }

    if (this.rotateZ !== 0) {
      Matrix4.rotateZ(this.#viewModel, this.#viewModel, this.rotateZ)
    }
    if (this.rotateX !== 0) {
      Matrix4.rotateX(this.#viewModel, this.#viewModel, this.rotateX)
    }
    if (this.rotateY !== 0) {
      Matrix4.rotateY(this.#viewModel, this.#viewModel, this.rotateY)
    }
    Matrix4.invert(this.#view, this.#viewModel)

    Matrix4.multiply(this.#modelView, this.#model, this.#view)
    Matrix4.multiply(this.#modelViewProjection, this.#camera.projection.matrix, this.#modelView)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.viewport(0, 0, this.#canvas.width, this.#canvas.height)

    gl.useProgram(this.#program)

    gl.uniformMatrix4fv(
      gl.getUniformLocation(this.#program, 'u_modelViewProjection'),
      false,
      this.#modelViewProjection.rawData
    )

    gl.bindVertexArray(this.#vaos.get('starfield'))
    gl.drawArrays(gl.POINTS, 0, 1000)
    gl.bindVertexArray(null)

    gl.bindVertexArray(this.#vaos.get('orbit'))
    gl.drawArrays(gl.LINE_LOOP, 0, 1000)
    gl.bindVertexArray(null)
  }
}

async function start() {

  const canvas = document.getElementById('game')
  const game = globalThis.game = new Game(canvas)
  const renderer = new CustomRenderer(canvas)
  game.pipeline.push(() => renderer.update(game))

  game.start()

}

/**
 * Esto podría hacer muchas más cosas: por ejemplo, cargar
 * el script del juego y luego llamar a start() cuando esté
 * listo.
 *
 * También se podría utilizar esto como una oportunidad para
 * darle opciones al jugador de qué es lo que debería ocurrir
 * al arrancar el juego: con/sin sonido, con/sin música, etc.
 */
const userGesture = document.querySelector('#user-gesture')
userGesture.onclick = () => {
  // userGesture.remove()
  userGesture.style.display = 'none'
  start()
}
