// src/scenes/GameScene.ts
import { Assets, Container, Sprite, Ticker, Text } from 'pixi.js'
import { Enemy } from '../objects/Enemy'
import { EnemySpawner } from '../objects/EnemySpawner'
import { SoundManager } from '../core/SoundManager'
import levelConfig from '../config/levels.json'
import { ControlBtns } from '../ui/ControlBtns'
import { CursorManager } from '../ui/CursorManager'
import { StarsCalculator } from '../utils/StarsCalculator'
import { LevelEndHandler } from '../utils/LevelEndHandler'

export class GameScene extends Container {
  public background!: Sprite
  public enemies: Enemy[] = []
  private enemyTimer = 0

  private timerText!: Text
  public killsText!: Text
  private levelText!: Text
  public timeLeft = 60
  public killCount = 0
  private elapsedTime = 0

  private cursorManager!: CursorManager
  public customCursor!: Sprite
  private currentLevelIndex = 0
  public currentLevel = levelConfig.levels[0]
  public pauseButton!: Sprite
  public playButton!: Sprite
  public pauseText!: Text
  public isPaused = false
  public soundButton!: Sprite
  public isSoundOn = true
  public superEnemyCount = 0
  public boosterButton!: Sprite
  public boosterUsed = false
  private enemySpawner!: EnemySpawner
  private controlBtns!: ControlBtns

  constructor(levelIndex = 0) {
    super()
    this.currentLevelIndex = levelIndex
    const level = levelConfig.levels[levelIndex]
    this.currentLevel = {
      ...level,
      speedRange: [level.speedRange[0], level.speedRange[1]] as [number, number]
    }
    this.enemySpawner = new EnemySpawner(this)
    this.init()
    SoundManager.play('start')
    Ticker.shared.add(this.update, this)
  }

  private async init() {
    await this.initBackground()
    await this.initUI()
    await this.initControls()
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  private async initBackground() {
    const texture = await Assets.load('./assets/backgrounds/background.jpg')
    this.background = new Sprite(texture)
    this.background.anchor.set(0.5)
    this.background.eventMode = 'static'
    this.background.cursor = 'none'
    this.background.on('pointerdown', () => {
      if (!this.isPaused) SoundManager.play('gun')
    })
    this.addChild(this.background)
  }

  private async initUI() {
    this.timeLeft = this.currentLevel.duration
    this.killCount = 0
    this.enemyTimer = 0
    this.elapsedTime = 0
    this.enemies = []

    const formatted = this.formatTime(this.timeLeft)
    this.timerText = this.createText(formatted, 30, 20)
    this.killsText = this.createText(
      'Score: 0',
      window.innerWidth - 30,
      20,
      true
    )
    this.levelText = this.createText(
      `Level ${this.currentLevel.id}`,
      window.innerWidth / 2,
      20,
      true
    )
    this.addChild(this.timerText, this.killsText, this.levelText)

    this.cursorManager = new CursorManager(this)
    await this.cursorManager.init()
    document.body.style.cursor = 'default'
  }

  private async initControls() {
    this.controlBtns = new ControlBtns(this)
    await this.controlBtns.init()
  }

  public createText(
    value: string,
    x: number,
    y: number,
    anchorRight = false
  ): Text {
    const text = new Text({
      text: value,
      style: {
        fontFamily: 'Arial',
        fontSize: 40,
        fill: '#ffffff',
        fontWeight: 'bold',
        stroke: { color: '#000000', width: 4 },
        dropShadow: {
          color: '#000000',
          alpha: 0.5,
          blur: 2,
          distance: 2,
          angle: 0.5
        }
      }
    })
    if (anchorRight) text.anchor.set(1, 0)
    text.x = x
    text.y = y
    return text
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused
    this.pauseText.visible = paused
    this.pauseButton.visible = !paused
    this.playButton.visible = paused
  }

  private resize() {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    const scale = Math.max(
      screenWidth / this.background.texture.width,
      screenHeight / this.background.texture.height
    )

    this.background.scale.set(scale)
    this.background.x = screenWidth / 2
    this.background.y = screenHeight / 2

    this.killsText.x = window.innerWidth - 30
    this.levelText.x = window.innerWidth / 2
  }

  private update(ticker: Ticker) {
    if (this.isPaused) return

    const delta = ticker.deltaMS / 16.66

    const levelEnded = this.handleTimer(delta)
    if (levelEnded) return

    this.handleEnemySpawn(delta)
    this.updateEnemies()
  }

  private handleTimer(delta: number): boolean {
    this.elapsedTime += delta / 60
    if (this.elapsedTime >= 1) {
      this.timeLeft--
      this.elapsedTime = 0
      this.timerText.text = this.formatTime(this.timeLeft)

      const stars = this.currentLevel.stars
      const timeElapsed = this.currentLevel.duration - this.timeLeft
      const enoughKillsEarly =
        (timeElapsed <= 20 && this.killCount >= stars['20']) ||
        (timeElapsed > 20 && timeElapsed <= 40 && this.killCount >= stars['40'])
      const timeIsUp = timeElapsed >= 60

      if (enoughKillsEarly || timeIsUp) {
        Ticker.shared.remove(this.update, this)
        this.showLevelEnd()
        return true
      }
    }
    return false
  }

  private handleEnemySpawn(delta: number) {
    this.enemyTimer += delta
    const spawnRate =
      this.currentLevel.spawnInterval / this.currentLevel.waveEnemyCount
    if (this.enemyTimer > spawnRate) {
      this.enemySpawner.spawnEnemy()
      this.enemyTimer = 0
    }
  }

  private updateEnemies() {
    if (!this.isPaused) {
      this.enemies.forEach((enemy) => enemy.update())
    }
    this.enemies = this.enemies.filter((e) => e.parent)
  }

  private formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0')
    return `${m}:${s}`
  }

  private showLevelEnd() {
    const stars = this.getStars()
    LevelEndHandler.handle({
      scene: this,
      killCount: this.killCount,
      currentLevelIndex: this.currentLevelIndex,
      stars,
      currentLevelId: this.currentLevel.id
    })
  }

  private getStars(): number {
    return StarsCalculator.calculate(
      this.currentLevel,
      this.timeLeft,
      this.killCount
    )
  }

  public showFloatingText(text: string, x: number, y: number) {
    const scoreText = new Text({
      text,
      style: {
        fontFamily: 'Arial',
        fontSize: 32,
        fill: '#ffff00',
        fontWeight: 'bold',
        stroke: { color: '#000000', width: 3 }
      }
    })
    scoreText.anchor.set(0.5)
    scoreText.x = x
    scoreText.y = y
    this.addChild(scoreText)

    let frame = 0
    const duration = 45
    const animate = () => {
      frame++
      scoreText.y -= 1
      scoreText.alpha = 1 - frame / duration
      if (frame < duration) {
        requestAnimationFrame(animate)
      } else {
        this.removeChild(scoreText)
      }
    }
    animate()
  }
}
