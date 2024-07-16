import { createAudioElement, createVideoElement, createImageElement } from "@taoro/media"

/**
 * Returns an <style> element from a Response.
 *
 * @param {Response} response
 * @returns {Promise<HTMLStyleElement>}
 */
export async function getAsStyle(response) {
  const text = await response.text()
  const style = document.createElement('style')
  style.textContent = text
  return style
}

/**
 * Returns a URL from a response (blob).
 *
 * @param {Response} response
 * @returns {Promise<string>}
 */
export async function getAsURL(response) {
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  return url
}

/**
 * Returns a FontFace from a Response.
 *
 * @param {Response} response
 * @param {FontFaceDescription} [description]
 * @returns {Promise<FontFace>}
 */
export async function getAsFontFace(response, { family, descriptors } = {}) {
  const url = new URL(response.url)
  console.log(url)
  const fontFamily = family ?? url.searchParams.get('taoro:family')
  if (!fontFamily) {
    throw new Error('Resources: Font family not specified')
  }
  const fontDescriptors = descriptors ?? {
    ascentOverride: url.searchParams.get('taoro:ascentOverride') ?? 'normal',
    descentOverride: url.searchParams.get('taoro:descentOverride') ?? 'normal',
    display: url.searchParams.get('taoro:display') ?? 'auto',
    featureSettings: url.searchParams.get('taoro:featureSettings') ?? 'normal',
    lineGapOverride: url.searchParams.get('taoro:lineGapOverride') ?? 'normal',
    stretch: url.searchParams.get('taoro:stretch') ?? 'normal',
    style: url.searchParams.get('taoro:style') ?? 'normal',
    unicodeRange: url.searchParams.get('taoro:unicodeRange') ?? 'U+0-10FFFF',
    variationSettings:
      url.searchParams.get('taoro:variationSettings') ?? 'normal',
    weight: url.searchParams.get('taoro:weight') ?? 'normal',
  }
  const fontSource = await response.arrayBuffer()
  const fontFace = new FontFace(fontFamily, fontSource, fontDescriptors)
  // Is this necessary? We should take care of this
  // in the resources manager or it should be done
  // manually by the user?
  document.fonts.add(fontFace)
  return fontFace
}

/**
 * Returns a Document from a Response.
 *
 * @param {Response} response
 * @param {DocumentDescription} options
 * @returns {Promise<Document>}
 */
export async function getAsDocument(response, { contentType } = {}) {
  const textContentType =
    contentType ?? response.headers.get('Content-Type') ?? 'text/xml'
  const text = await response.text()
  const parser = new DOMParser()
  const document = parser.parseFromString(
    text,
    textContentType.slice(0, textContentType.indexOf(';'))
  )
  return document
}

/**
 * Returns an <img> element from a Response.
 *
 * @param {Response} response
 * @param {CreateImageOptions} options
 * @returns {Promise<HTMLImageElement>}
 */
export async function getAsImageElement(response, options) {
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  return createImageElement(url, options)
}

/**
 * Returns an ImageBitmap from a Response.
 *
 * @param {Response} response
 * @param {CreateImageBitmapOptions} options
 * @returns {Promise<ImageBitmap>}
 */
export async function getAsImageBitmap(response, options) {
  const blob = await response.blob()
  const imageBitmap = await createImageBitmap(blob, options)
  return imageBitmap
}

/**
 * Returns an Image from a Response.
 *
 * @param {Response} response
 * @param {*} options
 * @returns {ImageBitmap|Image}
 */
export async function getAsImage(response, options) {
  const url = new URL(response.url)
  if (url.searchParams.get('taoro:as') === 'imagebitmap') {
    return getAsImageBitmap(response, options)
  }
  return getAsImageElement(response, options)
}

/**
 * Returns an AudioBuffer from a Response.
 *
 * @param {Response} response
 * @param {*} param1
 * @returns {AudioBuffer}
 */
export async function getAsAudioBuffer(response, { audioContext = new AudioContext() } = {}) {
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  audioContext.close()
  return audioBuffer
}

/**
 * Returns an HTMLAudioElement from a Response.
 *
 * @param {Response} response
 * @param {*} options
 * @returns {HTMLAudioElement}
 */
export async function getAsAudioElement(response, options) {
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  return createAudioElement(url, options)
}

/**
 * Returns an HTMLAudioElement or AudioBuffer from Response.
 *
 * @param {Response} response
 * @param {*} options
 * @returns {AudioBuffer|HTMLAudioElement}
 */
export async function getAsAudio(response, options) {
  const url = new URL(response.url)
  if (url.searchParams.get('taoro:as') === 'audiobuffer') {
    return getAsAudioBuffer(response, options)
  }
  return getAsAudioElement(response, options)
}

/**
 * Returns an HTMLVideoElement from a Response.
 *
 * @param {Response} response
 * @param {*} options
 * @returns {HTMLVideoElement}
 */
export async function getAsVideoElement(response, options) {
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  return createVideoElement(url, options)
}

/**
 * Returns an HTMLVideoElement from a Response.
 *
 * @param {Response} response
 * @param {*} options
 * @returns {HTMLVideoElement}
 */
export async function getAsVideo(response, options) {
  return getAsVideoElement(response, options)
}

/**
 * Returns the response depending on multiple response data.
 *
 * @param {Response} response
 * @returns {Object|Array|FontFace|string|Document|AudioBuffer|HTMLStyleElement|HTMLAudioElement|HTMLVideoElement|Image|ImageBitmap|Blob|ArrayBuffer}
 */
export async function getResourceFromResponse(response) {
  const url = new URL(response.url)
  const asType = url.searchParams.get('taoro:as')
  const contentType = response.headers.get('Content-Type')
  if (asType === 'json'
   || contentType.startsWith('application/json')) {
    return response.json()
  } else if (asType === 'text'
          || contentType.startsWith('text/plain')) {
    return response.text()
  } else if (
    asType === 'document' ||
    contentType.startsWith('text/html') ||
    contentType.startsWith('text/xml')
  ) {
    return getAsDocument(response, { contentType })
  } else if (asType === 'style'
          || contentType.startsWith('text/css')) {
    return getAsStyle(response)
  } else if (asType === 'font'
          || contentType.startsWith('font/')) {
    return getAsFontFace(response)
  } else if (asType === 'image'
          || asType === 'imagebitmap'
          || contentType.startsWith('image/')) {
    return getAsImage(response)
  } else if (asType === 'audio'
          || asType === 'audiobuffer'
          || contentType.startsWith('audio/')) {
    return getAsAudio(response)
  } else if (asType === 'video'
          || contentType.startsWith('video/')) {
    return getAsVideo(response)
  } else if (asType === 'blob') {
    return response.blob()
  } else {
    return response.arrayBuffer()
  }
}

/**
 * Loads a resource.
 *
 * @param  {...any} init
 * @returns {Promise<Object|Array|FontFace|string|Document|AudioBuffer|HTMLStyleElement|HTMLAudioElement|HTMLVideoElement|Image|ImageBitmap|Blob|ArrayBuffer>}
 */
export async function load(...init) {
  const response = await fetch(...init)
  if (!response.ok) {
    throw new Error(`Resources: Failed to load ${response.url}`)
  }
  return getResourceFromResponse(response)
}

export default {
  load,
  getAsStyle,
  getAsURL,
  getAsFontFace,
  getAsDocument,
  getAsImageElement,
  getAsImageBitmap,
  getAsImage,
  getAsAudioBuffer,
  getAsAudioElement,
  getAsAudio,
  getAsVideoElement,
  getAsVideo,
}
