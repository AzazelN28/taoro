import { AudioChannelName } from '@taoro/audio-channel'
import { MusicSource } from '@taoro/audio-music-source'

export const MusicCrossFadeDirection = {
  A_TO_B: 'a->b',
  B_TO_A: 'b->a'
}

/**
 * Music Subsystem
 */
export class Music {
  #audio = null
  #channelName = null
  #a = null
  #b = null

  /**
   * Creates a new Music Subsystem
   *
   * @param {Audio} Audio system
   * @param {string} [channelName=AudioChannelName.MUSIC]
   */
  constructor(audio, channelName = AudioChannelName.MUSIC) {
    this.#channelName = channelName
    this.#audio = audio
    this.#a = new MusicSource(audio.audioContext)
    this.#a.connect(audio.get(channelName).destination)
    this.#b = new MusicSource(audio.audioContext)
    this.#b.connect(audio.get(channelName).destination)
  }

  get audio() {
    return this.#audio
  }

  get channelName() {
    return this.#channelName
  }

  get isPlaying() {
    return this.#a.isPlaying || this.#b.isPlaying
  }

  get a() {
    return this.#a
  }

  get b() {
    return this.#b
  }

  /**
   * Cross fades from track a to track b or track b to track a.
   *
   * @param {MusicCrossFadeDirection} direction Direction of the cross fade.
   * @param {number} [duration=1] Duration of the cross fade (by default is 1 second). 
   */
  crossFade(direction = MusicCrossFadeDirection.A_TO_B, duration = 1) {
    if (direction === MusicCrossFadeDirection.A_TO_B) {
      this.#a.fadeOut(duration)
      this.#b.fadeIn(duration)
    } else {
      this.#a.fadeIn(duration)
      this.#b.fadeOut(duration)
    }
    return this
  }
}

export default Music
