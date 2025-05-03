import { Assets, Container, Sprite } from 'pixi.js'
import { SceneManager } from '../core/SceneManager'
import { GameScene } from './GameScene'
import { Button } from '../ui/Button'
import { SoundManager } from '../core/SoundManager'

export class MainMenu extends Container {
  private background!: Sprite
  private startButton!: Button

  constructor() {
    super()
    document.body.style.cursor = 'default'
    this.init()
  }

  private async init() {
    const texture = await Assets.load(
      './assets/backgrounds/menu-background.jpg'
    )
    this.background = new Sprite(texture)
    this.background.anchor.set(0.5)
    this.addChild(this.background)

    await SoundManager.init()

    this.startButton = new Button('Start Game', 0, 0, () => {
      SoundManager.play('button')
      SceneManager.changeScene(new GameScene())
    })
    this.addChild(this.startButton)

    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  private resize() {
    const w = window.innerWidth
    const h = window.innerHeight

    const texW = this.background.texture.width
    const texH = this.background.texture.height
    const scale = Math.max(w / texW, h / texH)

    this.background.scale.set(scale)
    this.background.x = w / 2
    this.background.y = h / 2

    this.startButton.x = w / 2
    this.startButton.y = h / 2
  }
}
