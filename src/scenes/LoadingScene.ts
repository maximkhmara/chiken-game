import { Container, Graphics, Text } from 'pixi.js'
import { Assets } from 'pixi.js'
import { sound } from '@pixi/sound'

export class LoadingScene extends Container {
  private progressBar: Graphics
  private progressBg: Graphics
  private progressText: Text

  constructor(onLoaded: () => void) {
    super()

    window.addEventListener(
      'pointerdown',
      () => {
        const audioContext = sound.context as unknown as AudioContext
        if (audioContext && audioContext.state === 'suspended') {
          audioContext.resume()
        }
      },
      { once: true }
    )

    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    const background = new Graphics()
      .rect(0, 0, screenWidth, screenHeight)
      .fill(0x7ba722)
    this.addChild(background)

    const text = new Text({
      text: 'Loading...',
      style: {
        fill: '#000000',
        fontSize: 40,
        fontFamily: 'Arial'
      }
    })
    text.anchor.set(0.5)
    text.x = screenWidth / 2
    text.y = screenHeight / 2 - 50
    this.addChild(text)

    this.progressBg = new Graphics()
      .roundRect(screenWidth / 2 - 160, screenHeight / 2 + 2, 320, 28, 6)
      .fill(0xdddddd)
    this.addChild(this.progressBg)

    this.progressBar = new Graphics()
    this.addChild(this.progressBar)

    this.progressText = new Text({
      text: '0%',
      style: {
        fill: '#000000',
        fontSize: 30,
        fontFamily: 'Arial'
      }
    })
    this.progressText.anchor.set(0.5)
    this.progressText.x = screenWidth / 2
    this.progressText.y = screenHeight / 2 + 60
    this.addChild(this.progressText)

    this.loadAssets(onLoaded)
  }

  private async loadAssets(onLoaded: () => void) {
    const assets = [
      // backgrounds
      './assets/backgrounds/background.jpg',
      './assets/backgrounds/menu-background.jpg',

      // buttons
      './assets/buttons/booster-off.png',
      './assets/buttons/booster-on.png',
      './assets/buttons/menu-btn.png',
      './assets/buttons/next-btn.png',
      './assets/buttons/pause-btn.png',
      './assets/buttons/play-btn.png',
      './assets/buttons/restart-btn.png',
      './assets/buttons/sound-off.png',
      './assets/buttons/sound-on.png',
      './assets/buttons/start-btn.png',

      // icons
      './assets/icons/0stars.png',
      './assets/icons/1stars.png',
      './assets/icons/2stars.png',
      './assets/icons/3stars.png',
      './assets/icons/cartridge.png',
      './assets/icons/cursor.png',
      './assets/icons/star.png',

      // sounds
      './assets/sounds/background.ogg',
      './assets/sounds/boost-time.mp3',
      './assets/sounds/button.ogg',
      './assets/sounds/chick_hit1.ogg',
      './assets/sounds/chick_hit2.ogg',
      './assets/sounds/empty_magazine.ogg',
      './assets/sounds/game_lose.ogg',
      './assets/sounds/game_win.ogg',
      './assets/sounds/gun_reload.ogg',
      './assets/sounds/gunblast.ogg',
      './assets/sounds/start-level.ogg',

      // sprites
      './assets/sprites/chiken-die.json',
      './assets/sprites/chiken-die.png',
      './assets/sprites/chiken-fly.json',
      './assets/sprites/chiken-fly.png'
    ]

    let loaded = 0
    const total = assets.length

    for (const asset of assets) {
      await Assets.load(asset)
      loaded++
      const progress = loaded / total
      this.updateProgress(progress)
    }
    // Автозапуск фонової музики після завантаження ресурсів
    try {
      const backgroundSound = await Assets.load(
        './assets/sounds/background.ogg'
      )
      if (!sound.exists('background')) {
        sound.add('background', backgroundSound)
      }
      sound.play('background', { loop: true, volume: 0.5 })
    } catch (e) {
      console.warn('Failed to play background music:', e)
    }

    onLoaded()
  }

  private updateProgress(progress: number) {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    this.progressBar.clear()
    this.progressBar
      .roundRect(
        screenWidth / 2 - 160,
        screenHeight / 2 + 2,
        320 * progress,
        28,
        6
      )
      .fill(0x00ff00)

    this.progressText.text = `${Math.round(progress * 100)}%`
  }
}
