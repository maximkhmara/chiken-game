// src/core/SoundManager.ts
import { sound } from '@pixi/sound'

export class SoundManager {
  private static isMuted = false

  static async init() {
    sound.add('background', '/assets/sounds/background.ogg')
    sound.add('gun', '/assets/sounds/gunblast.ogg')
    sound.add('chick_hit', '/assets/sounds/chick_hit1.ogg')
    sound.add('chick_hit2', '/assets/sounds/chick_hit2.ogg')
    sound.add('start', '/assets/sounds/start-level.ogg')
    sound.add('button', '/assets/sounds/button.ogg')
    sound.add('game_win', '/assets/sounds/game_win.ogg')
    sound.add('game_lose', '/assets/sounds/game_lose.ogg')
    sound.add('boost-time', '/assets/sounds/boost-time.mp3')

    // Очікуємо взаємодії користувача, щоб дозволити запуск звуку
    const unlockAudio = () => {
      const context = sound.context.audioContext
      if (context.state === 'suspended') {
        context.resume().catch(console.warn)
      }
      window.removeEventListener('pointerdown', unlockAudio)
    }

    window.addEventListener('pointerdown', unlockAudio)

    // Запуск фонової музики
    sound.play('background', { loop: true, volume: 0.2 })
  }

  static play(name: string) {
    if (!this.isMuted) {
      sound.play(name)
    }
  }

  static toggleMute() {
    this.isMuted = !this.isMuted
    sound.volumeAll = this.isMuted ? 0 : 1
  }

  static setMute(mute: boolean) {
    this.isMuted = mute
    sound.volumeAll = mute ? 0 : 1
  }

  static getMuted(): boolean {
    return this.isMuted
  }
}
