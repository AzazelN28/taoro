/**
 * @typedef {object} CreateMediaElementOptions
 * @property {boolean} [muted=false]
 * @property {boolean} [autoPlay=false]
 * @property {string} [crossOrigin='anonymous']
 * @property {boolean} [canPlayThrough=true]
 */

/**
 * @typedef {object} CreateImageOptions
 * @property {string} [crossOrigin='anonymous']
 * @property {'eager'|'lazy'} [loading='eager']
 * @property {'async'|'sync'} [decoding='async']
 */

/**
 * Creates a media element.
 *
 * @param {'audio'|'video'} tag
 * @param {string} src
 * @param {CreateMediaElementOptions} [options]
 * @returns {HTMLVideoElement|HTMLAudioElement}
 */
export function createMediaElement(tag, src, { muted = false, autoPlay = false, crossOrigin = 'anonymous', canPlayThrough = true } = {}) {
  return new Promise((resolve, reject) => {
    if (!['video', 'audio'].includes(tag)) {
      throw new Error('Invalid tag, must be either video or audio')
    }
    const element = document.createElement(tag)
    if (canPlayThrough) {
      element.oncanplaythrough = () => resolve(element)
    } else {
      element.oncanplay = () => resolve(element)
    }
    element.onabort = () => reject(new Error('Abort'))
    element.onerror = () => reject(element.error)
    element.muted = muted ?? false
    element.autoplay = autoPlay ?? false
    element.crossOrigin = crossOrigin ?? ''
    element.src = src
  })
}

/**
 * Creates a video element.
 *
 * @param {string} src
 * @param {CreateMediaElementOptions} [options]
 * @returns {HTMLVideoElement}
 */
export function createVideoElement(src, options) {
  return createMediaElement('video', src, options)
}

/**
 * Creates an audio element.
 *
 * @param {string} src
 * @param {CreateMediaElementOptions} [options]
 * @returns {HTMLAudioElement}
 */
export function createAudioElement(src, options) {
  return createMediaElement('audio', src, options)
}

/**
 * Creates an image element.
 *
 * TODO: Add support for SVG Image elements.
 *
 * @param {string} src
 * @param {CreateImageOptions} [options]
 * @returns {HTMLImageElement}
 */
export function createImageElement(src, { crossOrigin = 'anonymous', loading = 'eager', decoding = 'async' } = {}) {
  return new Promise((resolve, reject) => {
    const element = document.createElement('img')
    element.onload = () => resolve(element)
    element.onabort = () => reject(new Error('Abort'))
    element.onerror = (error) => reject(error)
    element.crossOrigin = crossOrigin ?? ''
    element.decoding = decoding ?? 'async'
    element.loading = loading ?? 'eager'
    element.src = src
  })
}

export default {
  createMediaElement,
  createVideoElement,
  createAudioElement,
  createImageElement,
}
