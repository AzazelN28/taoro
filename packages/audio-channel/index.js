/**
 * Enumeration of common audio channel names.
 *
 * @enum {string}
 */
export const AudioChannelName = {
  MASTER: 'master',
  SFX: 'sfx',
  MUSIC: 'music',
}

Object.defineProperties(AudioChannelName, {
  isAudioChannelName: {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (value) {
      return Object.values(AudioChannelName).includes(value)
    },
  },
  isMaster: {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (value) {
      return value === AudioChannelName.MASTER
    }
  }
})

/**
 * An AudioChannel contains two nodes: gain and stereo panning, this allows
 * us to control these independently.
 */
export class AudioChannel {
  #gainNode = null
  #stereoPannerNode = null

  /**
   * Creates a new AudioChannel
   *
   * @param {AudioContext} audioContext
   */
  constructor(audioContext) {
    this.#gainNode = audioContext.createGain()
    this.#stereoPannerNode = audioContext.createStereoPanner()

    this.#gainNode.connect(this.#stereoPannerNode)
  }

  get destination() {
    return this.#gainNode
  }

  set gain(value) {
    this.#gainNode.gain.value = value
  }

  get gain() {
    return this.#gainNode.gain.value
  }

  set pan(value) {
    this.#stereoPannerNode.pan.value = value
  }

  get pan() {
    return this.#stereoPannerNode.pan.value
  }

  connect(...args) {
    return this.#stereoPannerNode.connect(...args)
  }

  disconnect() {
    return this.#stereoPannerNode.disconnect()
  }
}

export default AudioChannel
