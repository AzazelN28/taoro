import { Audio, AudioChannelName } from '@taoro/audio'

/**
 * Extensions by MIME type.
 */
const extensions = {
  'video/webm': 'webm',
  'video/mp4': 'mp4',
  'video/ogg': 'ogg'
}

/**
 * Returns the file extension for a given MIME type.
 *
 * @param {string} mimeType
 * @returns {string}
 */
function getFileExtension(mimeType) {
  const type = mimeType.slice(0, mimeType.indexOf(';'))
  if (!(type in extensions)) {
    throw new Error(`Unsupported MIME type: ${mimeType}`)
  }
  return extensions[type]
}

/**
 * Options for the MediaRecorder.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder#Syntax
 * @typedef {Object} RecorderMediaRecorderOptions
 * @property {string} [mimeType=video/webm;codecs=vp9] A MIME type specifying the format for the resulting media
 * @property {number} [audioBitsPerSecond=128000] The number of bits per second of audio
 * @property {number} [videoBitsPerSecond=2500000] The number of bits per second of video
 * @property {number} [bitsPerSecond=2628000] The number of bits per second of audio and video
 */


/**
 * Options for the recorder.
 *
 * @typedef {Object} RecorderOptions
 * @property {boolean} [autoSave=false] If the recording should be saved automatically.
 * @property {string} [fileNameTemplate='Recording %d'] The template for the file name.
 * @property {RecorderMediaRecorderOptions} [recorder] Options for the underlying MediaRecorder.
 */

/**
 * Enumerates the possible states of a recorder.
 *
 * @enum {string}
 */
export const RecorderState = {
  STOPPED: 'stopped',
  STOPPING: 'stopping',
  PAUSED: 'paused',
  PAUSING: 'pausing',
  RESUMED: 'resumed',
  RESUMING: 'resuming',
  STARTED: 'started',
  STARTING: 'starting',
  FAILED: 'failed'
}

/**
 * Records the video and audio output of a game.
 */
export class Recorder {
  /**
   * Returns if the browser supports the MediaRecorder API,
   * the MediaStreamDestinationNode, etc.
   *
   * @returns {boolean}
   */
  static isSupported() {
    return 'MediaRecorder' in window
  }

  /**
   * Returns if the browser supports the given MIME type.
   *
   * @param  {...any} args
   * @returns
   */
  static isTypeSupported(...args) {
    return MediaRecorder.isTypeSupported(...args)
  }

  #recorder = null
  #state = RecorderState.STOPPED
  #timeout = null
  #autoSave = false
  #fileNameTemplate = 'Recording %d'
  #chunks = []

  #onDataAvailable = (e) => this.#chunks.push(e.data)
  #onStop = (e) => {
    if (this.#autoSave) {
      const fileName = this.#fileNameTemplate.replace(
        '%d',
        new Date().toISOString()
      )
      this.saveAs(fileName)
    }
    this.#state = RecorderState.STOPPED
  }
  #onStart = (e) => {
    this.#state = RecorderState.STARTED
    this.#chunks.length = 0
  }
  #onPause = (e) => (this.#state = RecorderState.PAUSED)
  #onResume = (e) => (this.#state = RecorderState.RESUMED)
  #onError = (e) => (this.#state = RecorderState.FAILED)
  #onTimeout = (e) => {
    this.#timeout = null
    this.#recorder.stop()
  }

  /**
   * Creates a new recorder instance.
   *
   * @param {HTMLCanvasElement|OffscreenCanvas} canvas
   * @param {Audio} audio
   * @param {RecorderOptions} [options]
   */
  constructor(canvas, audio, options) {
    const mixedStream = this.#getMixedStream(canvas, audio)
    this.#autoSave = options?.autoSave ?? false
    this.#fileNameTemplate = options?.fileNameTemplate ?? 'Recording %d'
    this.#recorder = new MediaRecorder(mixedStream, options?.recorder)
    this.#recorder.ondataavailable = this.#onDataAvailable
    this.#recorder.onstop = this.#onStop
    this.#recorder.onstart = this.#onStart
    this.#recorder.onpause = this.#onPause
    this.#recorder.onresume = this.#onResume
    this.#recorder.onerror = this.#onError
  }

  /**
   * Returns the mixed MediaStream of audio and video.
   *
   * @param {HTMLCanvasElement|OffscreenCanvas} canvas
   * @param {Audio} audio
   * @returns {MediaStream}
   */
  #getMixedStream(canvas, audio) {
    const videoStream = canvas.captureStream()
    const mediaStreamDestination = audio.context.createMediaStreamDestination()
    audio.get(AudioChannelName.MASTER).connect(mediaStreamDestination)
    const audioStream = mediaStreamDestination.stream
    const videoTracks = videoStream.getVideoTracks()
    const audioTracks = audioStream.getAudioTracks()
    return new MediaStream([...videoTracks, ...audioTracks])
  }

  /**
   * Returns the current state of the recorder.
   *
   * @type {RecorderState}
   */
  get state() {
    return this.#state
  }

  /**
   * Saves the recorded data as a file.
   *
   * @param {string} fileName
   * @returns {Promise<void>}
   */
  async saveAs(fileName) {
    if (this.#chunks.length === 0) {
      console.warn('Recorder: No data to download')
      return Promise.resolve()
    }

    const blob = new Blob(this.#chunks, { type: this.#recorder.mimeType })
    const fileExtension = getFileExtension(this.#recorder.mimeType)
    if (
      'showSaveFilePicker' in window &&
      typeof window.showSaveFilePicker === 'function'
    ) {
      const fileHandle = await window.showSaveFilePicker({
        types: [
          {
            description: 'Video',
            accept: { 'video/*': [fileExtension] },
          },
        ],
      })
      const writable = await fileHandle.createWritable()
      await writable.write(blob)
      await writable.close()
    } else {
      const a = document.createElement('a')
      const url = URL.createObjectURL(blob)
      a.href = url
      a.download = `${fileName}.${fileExtension}`
      a.click()
      return Promise.resolve()
    }
  }

  /**
   * Pauses the recording.
   */
  pause() {
    this.#state = RecorderState.PAUSING
    return this.#recorder.pause()
  }

  /**
   * Resumes the recording.
   */
  resume() {
    this.#state = RecorderState.RESUMING
    return this.#recorder.resume()
  }

  /**
   * Starts the recording.
   *
   * @param {number} [timeslice]
   */
  start(timeslice) {
    this.#state = RecorderState.STARTING
    return this.#recorder.start(timeslice)
  }

  /**
   * Stops the recording.
   */
  stop() {
    this.#state = RecorderState.STOPPING
    if (this.#timeout !== null) {
      clearTimeout(this.#timeout)
    }
    return this.#recorder.stop()
  }

  /**
   * Records for the given amount of seconds.
   *
   * @param {number} seconds
   * @param {number} [timeslice]
   */
  record(seconds, timeslice) {
    if (!Number.isFinite(seconds)) {
      throw new TypeError('Recorder: Seconds should be a finite number')
    }
    if (this.#recorder.state === 'recording') {
      throw new Error('Recorder: The recorder is already recording')
    }
    if (this.#recorder.state === 'paused') {
      this.#state = RecorderState.RESUMING
      this.#recorder.resume()
    } else {
      this.#state = RecorderState.STARTING
      this.#recorder.start(timeslice)
    }
    this.#timeout = setTimeout(this.#onTimeout, seconds * 1000)
  }
}
