// src/objects/Enemy.ts
import { AnimatedSprite, Assets, Container, Texture } from 'pixi.js'
import { SoundManager } from '../core/SoundManager'

export class Enemy extends Container {
  private fly!: AnimatedSprite
  private dieAnim!: AnimatedSprite
  private isDead = false
  private speed!: number
  private gameScene: any
  private isSuper = false
  public setGameScene(scene: any) {
    this.gameScene = scene
  }

  constructor(x: number, y: number, isSuper = false) {
    super()

    const direction = Math.random() < 0.5 ? 'left' : 'right'
    this.speed = 1 + Math.random() * 2
    if (direction === 'right') this.speed *= -1

    this.isSuper = isSuper
    if (this.isSuper) {
      this.speed *= 1.5
    }

    this.x = direction === 'left' ? -100 : window.innerWidth + 100
    this.y = y

    this.loadAnimations(direction, isSuper)
  }

  public setSpeed(value: number) {
    this.speed = value
  }

  public isKilled(): boolean {
    return this.isDead
  }

  public triggerDeath() {
    this.dieAnimation()
  }

  private async loadAnimations(direction: 'left' | 'right', isSuper: boolean) {
    const flySheet = await Assets.load('./assets/sprites/chiken-fly.json')
    const dieSheet = await Assets.load('./assets/sprites/chiken-die.json')

    const flyTextures = Object.values(flySheet.textures).filter(
      (t): t is Texture => t instanceof Texture
    )
    const dieTextures = Object.values(dieSheet.textures).filter(
      (t): t is Texture => t instanceof Texture
    )

    this.fly = new AnimatedSprite(flyTextures)
    this.fly.anchor.set(0.5)
    this.fly.animationSpeed = 0.2
    this.fly.scale.set(isSuper ? 0.5 : 1)
    this.fly.play()

    this.dieAnim = new AnimatedSprite(dieTextures)
    this.dieAnim.scale.set(isSuper ? 0.5 : 1)
    this.dieAnim.anchor.set(0.5)
    this.dieAnim.animationSpeed = 0.25
    this.dieAnim.loop = false

    if (direction === 'left') {
      this.scale.x = -1
    }

    this.addChild(this.fly)
    this.eventMode = 'static'
    this.cursor = 'none'
    this.on('pointerdown', () => {
      if (!this.gameScene?.isPaused) {
        this.dieAnimation()
      }
    })
  }

  private dieAnimation() {
    if (this.isDead) return
    this.isDead = true

    SoundManager.play('gun')
    SoundManager.play(this.isSuper ? 'chick_hit2' : 'chick_hit')

    this.fly.stop()
    this.removeChild(this.fly)
    this.addChild(this.dieAnim)
    this.dieAnim.play()

    const startY = this.y
    const targetY = this.y + 100
    const duration = 120
    let frame = 0

    this.dieAnim.onComplete = () => {
      this.emit('killed')
      this.removeFromParent()
    }

    const fallTicker = () => {
      frame++
      if (frame >= duration / 2 && frame <= duration) {
        const progress = (frame - duration / 2) / (duration / 2)
        this.y = startY + (targetY - startY) * progress
        this.alpha = 1 - progress
      }
      if (frame <= duration) {
        requestAnimationFrame(fallTicker)
      }
    }

    requestAnimationFrame(fallTicker)
  }

  public update() {
    if (!this.isDead) this.x += this.speed
    if (this.x > window.innerWidth + 100 || this.x < -100) {
      this.removeFromParent()
    }
  }
}
