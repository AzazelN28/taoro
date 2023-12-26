import { Point } from '@taoro/math-point'
import { Rect } from '@taoro/math-rect'
import { Component } from '@taoro/component'
import { TransformComponent } from '@taoro/component-transform-2d'
import { FastImageData } from '@taoro/fast-image-data'

export function createImageDataFromImage(image, x = 0, y = 0, width = 0, height = 0) {
  const canvas = new OffscreenCanvas(image.width, image.height)
  const context = canvas.getContext('2d', {
    willReadFrequently: true,
  })
  context.drawImage(image, 0, 0)
  return context.getImageData(x, y, width, height)
}

export function transparentColor(imageData, r, g, b) {
  const data = imageData.data
  for (let offset = 0; offset < data.length; offset += 4) {
    if (data[offset + 0] === r
     && data[offset + 1] === g
     && data[offset + 2] === b) {
      data[offset + 3] = 0
    }
  }
  return imageData
}

export function createFastImageDataArrayFromImage(image, width, height, { stepWidth = -1, stepHeight = -1, columns = -1, rows = -1 } = {}) {
  const canvas = new OffscreenCanvas(image.width, image.height)
  const context = canvas.getContext('2d', {
    willReadFrequently: true,
  })
  context.drawImage(image, 0, 0)

  const imageColumns = columns < 0 ? Math.floor(image.width / width) : columns
  const imageRows = rows < 0 ? Math.floor(image.height / height) : rows

  const imageStepWidth = stepWidth < 0 ? image.width / imageColumns : stepWidth
  const imageStepHeight = stepHeight < 0 ? image.height / imageRows : stepHeight

  const imageDataArray = []
  for (let row = 0; row < imageRows; ++row) {
    for (let column = 0; column < imageColumns; ++column) {
      const imageData = FastImageData.fromImageData(context.getImageData(
        column * imageStepWidth,
        row * imageStepHeight,
        width,
        height
      ))
      imageDataArray.push(imageData)
    }
  }

  return imageDataArray
}

export function createImageDataArrayFromImage(image, width, height, columns = -1, rows = -1) {
  const canvas = new OffscreenCanvas(image.width, image.height)
  const context = canvas.getContext('2d', {
    willReadFrequently: true,
  })
  context.drawImage(image, 0, 0)

  const imageColumns = columns < 0 ? Math.floor(image.width / width) : columns
  const imageRows = rows < 0 ? Math.floor(image.height / height) : rows

  const stepWidth = image.width / imageColumns
  const stepHeight = image.height / imageRows

  const imageDataArray = []
  for (let row = 0; row < imageRows; ++row) {
    for (let column = 0; column < imageColumns; ++column) {
      const imageData = context.getImageData(
        column * stepWidth,
        row * stepHeight,
        width,
        height
      )
      imageDataArray.push(imageData)
    }
  }

  return imageDataArray
}

const spriteMap = new Map()

// TODO: Refactor this into an external package.
export class Level {
  #width = 0
  #height = 0
  #data = null

  constructor(width, height, data) {
    this.#width = width
    this.#height = height
    this.#data = data
  }

  get width() {
    return this.#width
  }

  get height() {
    return this.#height
  }

  get data() {
    return this.#data
  }
}

/**
 * Enum that holds the possible sides where a ray can hit.
 *
 * @readonly
 * @enum {number}
 */
export const RaySide = {
  NONE: 0,
  X: 1,
  Y: 2,
  OUTSIDE: 3,
}

/**
 * Ray
 */
export class Ray {
  constructor() {
    this.visited = new Set()
    this.direction = new Point()
    this.position = new Point()
    this.tile = new Point()
    this.step = new Point()
    this.sideDist = new Point()
    this.deltaDist = new Point()
    this.side = RaySide.NONE
    this.distance = Infinity
    this.data = 0
    this.x = 0
    this.hit = false
  }

  updateFromCamera(camera) {
    this.position.copy(camera.position)
    this.visited.clear()
    return this
  }

  cast(level, camera, x) {
    this.hit = false
    this.side = RaySide.NONE
    this.data = 0

    this.tile.copy(camera.tile)
    this.direction.copy(camera.direction).addScaled(camera.plane, x)
    this.visited.add(this.tile.y * level.width + this.tile.x)

    this.deltaDist.set(
      Math.abs(1 / this.direction.x),
      Math.abs(1 / this.direction.y)
    )

    if (this.direction.x < 0) {
      this.sideDist.x = (this.position.x - this.tile.x) * this.deltaDist.x
      this.step.x = -1
    } else {
      this.sideDist.x = (this.tile.x + 1.0 - this.position.x) * this.deltaDist.x
      this.step.x = 1
    }

    if (this.direction.y < 0) {
      this.sideDist.y = (this.position.y - this.tile.y) * this.deltaDist.y
      this.step.y = -1
    } else {
      this.sideDist.y = (this.tile.y + 1.0 - this.position.y) * this.deltaDist.y
      this.step.y = 1
    }

    while (!this.hit) {
      if (this.sideDist.x < this.sideDist.y) {
        this.sideDist.x += this.deltaDist.x
        this.tile.x += this.step.x
        this.side = RaySide.X
      } else {
        this.sideDist.y += this.deltaDist.y
        this.tile.y += this.step.y
        this.side = RaySide.Y
      }

      const { x, y } = this.tile
      if (x < 0 || x >= level.width || y < 0 || y >= level.height) {
        this.hit = true
        this.side = RaySide.OUTSIDE
        this.data = 0
        break
      }

      const offset = y * level.width + x
      this.visited.add(offset)
      if (level.data[offset] != 0) {
        this.hit = true
        this.data = level.data[offset]
        break
      }
    }

    if (this.side === RaySide.X) {
      this.distance = this.sideDist.x - this.deltaDist.x
      this.x = this.position.y + this.distance * this.direction.y
    } else if (this.side === RaySide.Y) {
      this.distance = this.sideDist.y - this.deltaDist.y
      this.x = this.position.x + this.distance * this.direction.x
    } else {
      this.distance = Infinity
    }
    this.x -= Math.floor(this.x)
    return this
  }
}

/**
 * Camera component
 */
export class CameraComponent extends Component {
  constructor(id, { x = 0, y = 0, width = 320, height = 200, fieldOfView = 0.66 } = {}) {
    super(id)
    // this.imageData = new ImageData(width, height)
    this.imageData = null
    this.frameBuffer = null
    this.fastFrameBuffer = null
    this.depthBuffer = new Float32Array(width)
    this.rect = new Rect(x, y, width, height)
    this.position = new Point()
    this.tile = new Point()
    this.direction = new Point()
    this.strafe = new Point()
    this.fieldOfView = fieldOfView ?? 0.66

    this.plane = new Point(0, fieldOfView)
    this.start = new Point(1, -fieldOfView)
    this.end = new Point(-1, fieldOfView)
    this.invDet = Infinity
  }
}

/**
 * Sprite component
 */
export class SpriteComponent extends Component {
  constructor(id, { texture = null, facets = null, color = 0xFF0000FF, width = 0, height = 0, pivot = null } = {}) {
    super(id)
    this.relative = new Point()
    this.irelative = new Point()
    this.distance = Infinity
    this.texture = texture ?? null
    this.color = color ?? 0xFF0000FF
    this.width = width ?? 0
    this.height = height ?? 0
    this.pivot = pivot ?? new Point()
  }
}

export class Renderer {
  #canvas = null
  #context = null
  #level = null
  #ray = new Ray()
  #textures = null
  #colors = null

  /**
   * Creates a new renderer.
   *
   * @param {HTMLCanvasElement|OffscreenCanvas} canvas
   * @param {RendererOptions} options
   */
  constructor(canvas, options) {
    this.#canvas = canvas
    this.#context = canvas.getContext('2d', {
      willReadFrequently: true,
    })
    // Level.
    this.#level = options.level
    this.clear = options?.clear ?? true
    // Rendering options.
    this.#textures = createFastImageDataArrayFromImage(options?.textures, 64, 64) ?? null
    this.#colors =
      options?.colors ??
      new Uint32Array([
        0xff0000ff, 0x770000ff, 0x00ff00ff, 0x007700ff, 0x0000ffff, 0x000077ff,
        0xffff00ff, 0x777700ff, 0xff00ffff, 0x770077ff, 0x00ffffff, 0x007777ff,
        0xffffffff, 0x777777ff, 0xff7700ff, 0x773300ff, 0x00ff77ff, 0x007733ff,
        0x0077ffff, 0x003377ff, 0xff77ffff, 0x773377ff,
      ])
    this.floor = options?.floor ?? true
    this.ceiling = options?.ceiling ?? true
    this.walls = options?.walls ?? true
    this.sky = options?.sky ?? true
  }

  /**
   * @readonly
   * @type {HTMLCanvasElement|OffscreenCanvas}
   */
  get canvas() {
    return this.#canvas
  }

  /**
   * @readonly
   * @type {CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D}
   */
  get context() {
    return this.#context
  }

  /**
   * Updates cameras
   *
   * @returns
   */
  #updateCameras() {
    // Update the cameras first.
    const cameras = Component.findByConstructor(CameraComponent)
    if (!cameras) {
      return
    }

    for (const camera of cameras) {
      const transform = Component.findByIdAndConstructor(
        camera.id,
        TransformComponent
      )
      if (!transform) {
        continue
      }

      camera.position.copy(transform.position)
      camera.tile.copy(camera.position).floor()
      camera.direction.polar(transform.rotation)
      camera.strafe.copy(camera.direction).perpRight()
      camera.plane.copy(camera.strafe).scale(camera.fieldOfView)
      camera.start.copy(camera.direction).subtract(camera.plane)
      camera.end.copy(camera.direction).add(camera.plane)
      camera.invDet = 1.0 / camera.plane.cross(camera.direction)
    }
  }

  /**
   * Updates sprites
   */
  #updateSprites() {
    // Update the sprites.
    const sprites = Component.findByConstructor(SpriteComponent)
    if (sprites) {
      const spriteTile = new Point()
      for (const sprite of sprites) {
        const transform = Component.findByIdAndConstructor(
          sprite.id,
          TransformComponent
        )
        if (!transform) {
          continue
        }

        spriteTile.copy(transform.position).floor()

        const tile = spriteTile.y * this.#level.width + spriteTile.x
        if (!spriteMap.has(tile)) {
          spriteMap.set(tile, new Set())
        }
        const spritesInTile = spriteMap.get(tile)
        spritesInTile.add(sprite)
      }
    }
  }

  /**
   * Updates the renderer.
   */
  update() {
    const projection = new Point()

    if (this.clear) {
      this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
    }

    spriteMap.clear()

    this.#updateCameras()
    this.#updateSprites()

    this.#context.fillStyle = '#888'
    this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height / 2)

    this.#context.fillStyle = '#666'
    this.#context.fillRect(
      0,
      this.#canvas.height / 2,
      this.#canvas.width,
      this.#canvas.height / 2
    )

    // Update the cameras first.
    const cameras = Component.findByConstructor(CameraComponent)
    if (!cameras) {
      return
    }

    const renderableSprites = []
    for (const camera of cameras) {
      // Limpiamos el set.
      this.#ray.updateFromCamera(camera)

      const { width, height, halfWidth, halfHeight } = camera.rect
      camera.imageData = this.#context.getImageData(0, 0, width, height)
      camera.frameBuffer = camera.imageData.data
      camera.fastFrameBuffer = new Uint32Array(camera.frameBuffer.buffer)
      camera.depthBuffer.fill(Infinity)

      /*
      // Renderizado del techo y el suelo.
      for (let y = 0; y < h; y++)
      {
        // direcciones de los rayos izquierdo y derecho.
        // rayDir for leftmost ray (x = 0) and rightmost ray (x = w)
        float rayDirX0 = dirX - planeX;
        float rayDirY0 = dirY - planeY;
        float rayDirX1 = dirX + planeX;
        float rayDirY1 = dirY + planeY;

        // Current y position compared to the center of the screen (the horizon)
        int p = y - height / 2;

        // Vertical position of the camera.
        float posZ = 0.5 * height;

        // Horizontal distance from the camera to the floor for the current row.
        // 0.5 is the z position exactly in the middle between floor and ceiling.
        float rowDistance = posZ / p;

        // calculate the real world step vector we have to add for each x (parallel to camera plane)
        // adding step by step avoids multiplications with a weight in the inner loop
        float floorStepX = rowDistance * (rayDirX1 - rayDirX0) / width;
        float floorStepY = rowDistance * (rayDirY1 - rayDirY0) / width;

        // real world coordinates of the leftmost column. This will be updated as we step to the right.
        float floorX = posX + rowDistance * rayDirX0;
        float floorY = posY + rowDistance * rayDirY0;

        for(int x = 0; x < width; ++x)
        {
          // Las coordenadas del tile
          // the cell coord is simply got from the integer parts of floorX and floorY
          const cellX = Math.floor(floorX);
          const cellY = Math.floor(floorY);

          // get the texture coordinate from the fractional part
          int tx = (int)(texWidth * (floorX - cellX)) & (texWidth - 1);
          int ty = (int)(texHeight * (floorY - cellY)) & (texHeight - 1);

          floorX += floorStepX;
          floorY += floorStepY;

          // choose texture and draw the pixel
          int floorTexture = 3;
          int ceilingTexture = 6;
          Uint32 color;

          // floor
          color = texture[floorTexture][texWidth * ty + tx];
          color = (color >> 1) & 8355711; // make a bit darker
          buffer[y][x] = color;

          //ceiling (symmetrical, at screenHeight - y - 1 instead of y)
          color = texture[ceilingTexture][texWidth * ty + tx];
          color = (color >> 1) & 8355711; // make a bit darker
          buffer[screenHeight - y - 1][x] = color;
        }
      }
      */

      // Renderizamos cada columna.
      for (let x = 0; x < width; x++) {
        this.#ray.cast(this.#level, camera, (x / width) * 2 - 1)
        if (this.#ray.side === RaySide.OUTSIDE) {
          continue
        }

        camera.depthBuffer[x] = this.#ray.distance

        const columnHeight = Math.floor(height / this.#ray.distance)
        const columnHalfHeight = columnHeight >> 1

        const texNum = (this.#ray.data - 1) * 2

        const drawOffsetY = Math.floor(-columnHalfHeight + halfHeight)
        const drawStartY = Math.min(
          Math.max(0, drawOffsetY),
          halfHeight
        )
        const drawEndY = Math.min(
          Math.max(halfHeight, Math.floor(columnHalfHeight + halfHeight)),
          height
        )

        // NOT USED!!!
        // const drawHeight = drawEndY - drawStartY
        for (let y = drawStartY; y < drawEndY; y++) {
          const offset = (y * width + x)
          if (this.#textures?.length > 0) {
            const textureIndex = this.#ray.side === RaySide.X ? texNum : texNum + 1
            const texture = this.#textures[textureIndex]
            const u = this.#ray.x
            const v = (y - drawOffsetY) / columnHeight
            const textureU = Math.floor(u * texture.width)
            const textureV = Math.floor(v * texture.height)
            const textureOffset = textureV * texture.width + textureU
            const color = texture.data[textureOffset]
            camera.fastFrameBuffer[offset] = color
          } else {
            const colorIndex = this.#ray.side === RaySide.X ? texNum : texNum + 1
            const color = this.#colors[colorIndex % this.#colors.length]
            camera.fastFrameBuffer[offset] = color
          }

          /*
          camera.frameBuffer[offset + 0] =
            this.#ray.side === RaySide.X ? 0xff : 0x77
          camera.frameBuffer[offset + 1] = this.#ray.data === 9 ? 0xff : 0x00
          camera.frameBuffer[offset + 2] = 0x00
          camera.frameBuffer[offset + 3] = 0xff
          */
        }
      }

      // TODO: Mejorar esto porque no tiene sentido
      // tener que estar recorriendo estos arrays
      // todo el rato. Creo que tendría más sentido
      // que el valor #visited lo mantenga el renderer
      // o el nivel y no el ray.
      for (const tile of this.#ray.visited) {
        if (!spriteMap.has(tile)) {
          continue
        }

        const spritesInTile = spriteMap.get(tile)
        renderableSprites.push(...spritesInTile)
      }

      // Calculamos la distancia de los sprites a la vista sólo
      // para aquellos sprites que están en el rango del visión
      // del jugador.
      for (const sprite of renderableSprites) {
        const transform = Component.findByIdAndConstructor(
          sprite.id,
          TransformComponent
        )
        if (!transform) {
          continue
        }

        // TODO: Esto ya no parece necesario porque el nuevo
        // algoritmo para calcular el sprite, no necesita
        // este valor y usa relative.
        sprite.irelative.x = camera.position.x - transform.position.x
        sprite.irelative.y = camera.position.y - transform.position.y

        sprite.relative.x = transform.position.x - camera.position.x
        sprite.relative.y = transform.position.y - camera.position.y

        sprite.distance =
          sprite.relative.x * sprite.relative.x +
          sprite.relative.y * sprite.relative.y
      }

      // Reordenamos los sprites.
      renderableSprites.sort((a, b) => b.distance - a.distance)

      // Renderizamos los sprites.
      let renderedSprites = 0
      for (const sprite of renderableSprites) {
        const transform = Component.findByIdAndConstructor(
          sprite.id,
          TransformComponent
        )
        if (!transform) {
          continue
        }

        // Update sprite projection.
        projection.set(
          camera.invDet * sprite.relative.cross(camera.direction),
          camera.invDet *
            (-camera.plane.y * sprite.relative.x +
              camera.plane.x * sprite.relative.y)
        )

        // If the sprite is behind the camera we don't need to render it.
        if (projection.y < 0) {
          continue
        }

        const spriteScreenX = Math.floor(
          halfWidth * (1 + projection.x / projection.y)
        )
        const spriteScale = (1 / projection.y)
        const spriteSize = Math.abs(Math.floor(height * spriteScale))
        const spriteHalfSize = spriteSize >> 1
        // const spriteHeight = spriteSize
        // const spriteHalfHeight = spriteHalfSize
        // const spriteWidth = spriteSize
        // const spriteHalfWidth = spriteHalfSize

        const drawStartY = Math.floor(-spriteHalfSize + halfHeight)
        const drawEndY = Math.floor(spriteHalfSize + halfHeight)
        const drawStartX = Math.floor(-spriteHalfSize + spriteScreenX)
        const drawEndX = Math.floor(spriteHalfSize + spriteScreenX)

        const drawMinY = Math.max(0, drawStartY)
        const drawMaxY = Math.min(height, drawEndY)
        const drawMinX = Math.max(0, drawStartX)
        const drawMaxX = Math.min(width, drawEndX)

        const angle = sprite.relative.angle - transform.rotation

        const isFaceted = Array.isArray(sprite.texture)
        const angleBetween = isFaceted ? Math.abs((angle / Math.PI + 1) / 2 - 1) + (1 / (sprite.texture.length * 2)) : 0
        const angleIndex = isFaceted ? Math.floor(angleBetween * sprite.texture.length) % sprite.texture.length : 0
        const texture = isFaceted
          ? sprite.texture[angleIndex]
          : sprite.texture

        for (let x = drawMinX; x < drawMaxX; x++) {
          if (projection.y > camera.depthBuffer[x]) {
            continue
          }

          const u = (x - drawStartX) / spriteSize
          const textureU = Math.floor(u * texture.width)

          camera.depthBuffer[x] = projection.y

          for (let y = drawMinY; y < drawMaxY; y++) {
            const offset = (y * width + x)
            const v = (y - drawStartY) / spriteSize
            const textureV = Math.floor(v * texture.height)
            const textureOffset = textureV * texture.width + textureU
            if (isFaceted) {
              const color = texture.data[textureOffset]
              // TODO: Esto podría ser un parámetro para la transparencia
              // pero deberíamos permitir también que se comprobase sólo
              // el canal alpha (como pone abajo).
              if (color !== 0xff880098) {
                camera.fastFrameBuffer[offset] = color
              }
            } else if (texture) {
              const color = texture.data[textureOffset]
              if (color !== 0xff880098) {
                camera.fastFrameBuffer[offset] = color
              }
            } else {
              camera.fastFrameBuffer[offset] = this.#colors[0]
            }
            // camera.frameBuffer[offset + 0] = 0x00
            // camera.frameBuffer[offset + 1] = 0xff
            // camera.frameBuffer[offset + 2] = 0x00
            // camera.frameBuffer[offset + 3] = 0xff
          }
        }

        renderedSprites++
      }

      this.#context.putImageData(camera.imageData, 0, 0)
    }
  }
}
