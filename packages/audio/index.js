import { Runnable } from '@taoro/runnable'
import { AudioChannel, AudioChannelName } from '@taoro/audio-channel'

const AUDIO_DEFAULT_CHANNEL_NAMES = [AudioChannelName.SFX, AudioChannelName.MUSIC]

export class Audio {
  #audioContext = null
  #channels = new Map()
  #runnable = new Runnable()

  constructor(audioContext = new AudioContext(), channelNames = AUDIO_DEFAULT_CHANNEL_NAMES) {
    this.#audioContext = audioContext

    // Add master channel
    this.add(AudioChannelName.MASTER)

    // Add channels
    channelNames.forEach((name) => this.add(name))
  }

  get audioContext() {
    return this.#audioContext
  }

  get isRunning() {
    return this.#runnable.isRunning
  }

  get isSuspended() {
    return this.#audioContext.state === 'suspended'
  }

  has(name) {
    return this.#channels.has(name)
  }

  get(name) {
    return this.#channels.get(name)
  }

  add(name) {
    if (this.#channels.has(name)) {
      return false
    }
    this.#channels.set(name, new AudioChannel(this.#audioContext))
    return true
  }

  delete(name) {
    if (AudioChannelName.isMaster(name)) {
      console.warn(`Cannot delete channel "${name}"`)
      return false
    }
    if (!this.#channels.has(name)) {
      return false
    }
    this.#channels.delete(name)
    return true
  }

  pause() {
    this.#audioContext.suspend()
  }

  resume() {
    this.#audioContext.resume()
  }

  start() {
    const result = this.#runnable.start()
    if (result) {
      for (const [name, channel] of this.#channels) {
        if (AudioChannelName.isMaster(name)) {
          channel.connect(this.#audioContext.destination)
        } else {
          channel.connect(this.#channels.get(AudioChannelName.MASTER).destination)
        }
      }
    }
    return result
  }

  stop() {
    const result = this.#runnable.stop()
    if (result) {
      for (const [, channel] of this.#channels) {
        channel.disconnect()
      }
    }
    return result
  }
}

export default Audio
