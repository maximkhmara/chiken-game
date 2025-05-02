// src/scenes/GameScene.ts
import { Assets, Container, Sprite, Ticker, Text, Graphics } from 'pixi.js'
import { Enemy } from '../objects/Enemy'
import { LevelEndPopup } from '../ui/LevelEndPopup'
import { SceneManager } from '../core/SceneManager'
import { MainMenu } from './MainMenu'
import { SoundManager } from '../core/SoundManager'
import levelConfig from '../config/levels.json'

export class GameScene extends Container {
  private background!: Sprite
  private enemies: Enemy[] = []
  private enemyTimer = 0

  private timerText!: Text
  private killsText!: Text
  private levelText!: Text
  private timeLeft = 60
  private killCount = 0
  private elapsedTime = 0

  private customCursor!: Sprite
  private currentLevelIndex = 0
  private currentLevel = levelConfig.levels[0]
  private pauseButton!: Sprite
  private playButton!: Sprite
  private pauseText!: Text
  private isPaused = false
  private soundButton!: Sprite
  private isSoundOn = true
  private superEnemyCount = 0
  private boosterButton!: Sprite
  private boosterUsed = false

  constructor(levelIndex = 0) {
    super()
    this.currentLevelIndex = levelIndex
    this.currentLevel = levelConfig.levels[levelIndex]
    this.init()
    SoundManager.play('start')
    Ticker.shared.add(this.update, this)
  }

  private async init() {
    const texture = await Assets.load('/assets/backgrounds/background.jpg')
    this.background = new Sprite(texture)
    this.background.anchor.set(0.5)
    this.background.eventMode = 'static'
    this.background.cursor = 'none'
    this.background.on('pointerdown', () => {
      if (!this.isPaused) SoundManager.play('gun')
    })
    this.addChild(this.background)

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

    await this.initCursor()
    await this.initPauseControls()
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  private createText(
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

  private async initCursor() {
    const cursorTexture = await Assets.load('/assets/icons/cursor.png')
    this.customCursor = new Sprite(cursorTexture)
    this.customCursor.anchor.set(0.5)
    this.customCursor.scale.set(0.5)
    this.customCursor.zIndex = 1000
    this.addChild(this.customCursor)

    document.body.style.cursor = 'none'
    window.addEventListener('mousemove', (e) =>
      this.customCursor.position.set(e.clientX, e.clientY)
    )
  }

  private async initPauseControls() {
    const pauseTexture = await Assets.load('/assets/buttons/pause-btn.png')
    this.pauseButton = new Sprite(pauseTexture)
    this.pauseButton.anchor.set(0.5)
    this.pauseButton.scale.set(0.5)
    this.pauseButton.x = 50
    this.pauseButton.y = window.innerHeight - 50
    this.pauseButton.eventMode = 'static'
    this.pauseButton.cursor = 'pointer'
    this.pauseButton.on('pointerdown', () => {
      SoundManager.play('button')
      this.setPaused(true)
    })
    // Add pause button hover effect
    this.pauseButton.on('pointerover', () => {
      this.pauseButton.scale.set(0.55)
    })
    this.pauseButton.on('pointerout', () => {
      this.pauseButton.scale.set(0.5)
    })
    this.addChild(this.pauseButton)

    const playTexture = await Assets.load('/assets/buttons/play-btn.png')
    this.playButton = new Sprite(playTexture)
    this.playButton.anchor.set(0.5)
    this.playButton.scale.set(0.5)
    this.playButton.x = 50
    this.playButton.y = window.innerHeight - 50
    this.playButton.eventMode = 'static'
    this.playButton.cursor = 'pointer'
    this.playButton.visible = false
    this.playButton.on('pointerdown', () => {
      SoundManager.play('button')
      this.setPaused(false)
    })
    this.addChild(this.playButton)

    const soundOnTexture = await Assets.load('/assets/buttons/sound-on.png')
    const soundOffTexture = await Assets.load('/assets/buttons/sound-off.png')

    this.soundButton = new Sprite(soundOnTexture)
    this.soundButton.anchor.set(0.5)
    this.soundButton.scale.set(0.5)
    this.soundButton.x =
      this.pauseButton.x +
      this.pauseButton.width * this.pauseButton.scale.x +
      45
    this.soundButton.y = this.pauseButton.y
    this.soundButton.eventMode = 'static'
    this.soundButton.cursor = 'pointer'
    this.soundButton.on('pointerdown', () => {
      this.isSoundOn = !this.isSoundOn
      SoundManager.setMute(!this.isSoundOn)
      this.soundButton.texture = this.isSoundOn
        ? soundOnTexture
        : soundOffTexture
    })
    // Add sound button hover effect
    this.soundButton.on('pointerover', () => {
      this.soundButton.scale.set(0.55)
    })
    this.soundButton.on('pointerout', () => {
      this.soundButton.scale.set(0.5)
    })
    this.addChild(this.soundButton)

    this.pauseText = this.createText(
      'PAUSE',
      window.innerWidth / 2,
      window.innerHeight / 2
    )
    this.pauseText.anchor.set(0.5)
    this.pauseText.visible = false
    this.addChild(this.pauseText)

    const boosterOnTexture = await Assets.load('/assets/buttons/booster-on.png')
    const boosterOffTexture = await Assets.load(
      '/assets/buttons/booster-off.png'
    )

    this.boosterButton = new Sprite(boosterOnTexture)
    this.boosterButton.anchor.set(0.5)
    this.boosterButton.scale.set(0.5)
    this.boosterButton.x =
      this.soundButton.x +
      this.soundButton.width * this.soundButton.scale.x +
      45
    this.boosterButton.y = this.pauseButton.y
    this.boosterButton.eventMode = 'static'
    this.boosterButton.cursor = 'pointer'
    this.boosterButton.on('pointerdown', () => {
      if (!this.boosterUsed) {
        this.timeLeft += 20
        this.boosterUsed = true
        this.boosterButton.texture = boosterOffTexture
        SoundManager.play('boost-time')
      }
    })
    this.boosterButton.on('pointerover', () => {
      if (!this.boosterUsed) this.boosterButton.scale.set(0.55)
    })
    this.boosterButton.on('pointerout', () => {
      this.boosterButton.scale.set(0.5)
    })
    this.addChild(this.boosterButton)
  }

  private setPaused(paused: boolean) {
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

  private spawnEnemy() {
    const { spawnPositions, waveEnemyCount, speedRange } = this.currentLevel
    const isFirstLevel = this.currentLevel.id === 1
    const maxSpawns = isFirstLevel
      ? Math.ceil(waveEnemyCount * 0.5)
      : waveEnemyCount
    for (let i = 0; i < maxSpawns; i++) {
      const progress =
        (this.currentLevel.duration - this.timeLeft) /
        this.currentLevel.duration
      const isSuper =
        Math.random() < 0.1 + 0.15 * progress && this.superEnemyCount < 15
      let speed =
        Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0]
      if (isSuper) {
        this.superEnemyCount++
        speed *= 1.5
      }
      const y = isSuper
        ? spawnPositions[
            Math.floor(Math.random() * Math.ceil(spawnPositions.length / 2))
          ]
        : spawnPositions[Math.floor(Math.random() * spawnPositions.length)]
      const direction = Math.random() < 0.5 ? 'left' : 'right'
      const x = direction === 'left' ? -100 : window.innerWidth + 100

      const enemy = new Enemy(x, y, isSuper)
      enemy.setGameScene(this)
      enemy.setSpeed(direction === 'left' ? speed : -speed)

      if (isSuper) {
        enemy.tint = 0xffcc00
        enemy.scale.set(0.6)
      }

      const scoreValue = isSuper ? 25 : 10
      const onEnemyKilled = () => {
        if (this.isPaused) return
        this.killCount += scoreValue
        this.killsText.text = `Score: ${this.killCount}`
        this.showFloatingText(`+${scoreValue}`, enemy.x, enemy.y)
      }
      enemy.once('pointerdown', onEnemyKilled)
      enemy.on('killed', () => {
        if (this.isPaused) return
        // prevent duplicate score
      })

      this.enemies.push(enemy)
      this.addChild(enemy)
    }
  }

  private update(ticker: Ticker) {
    if (this.isPaused) return

    const delta = ticker.deltaMS / 16.66
    this.enemyTimer += delta
    this.elapsedTime += delta / 60

    if (this.elapsedTime >= 1) {
      this.timeLeft--
      this.elapsedTime = 0
      this.timerText.text = this.formatTime(this.timeLeft)

      const stars = this.currentLevel.stars
      const timeElapsed = this.currentLevel.duration - this.timeLeft
      if (
        (timeElapsed <= 20 && this.killCount >= stars['20']) ||
        (timeElapsed > 20 &&
          timeElapsed <= 40 &&
          this.killCount >= stars['40']) ||
        timeElapsed >= 60
      ) {
        Ticker.shared.remove(this.update, this)
        this.showLevelEnd()
        return
      }
    }

    const spawnRate =
      this.currentLevel.spawnInterval / this.currentLevel.waveEnemyCount
    if (this.enemyTimer > spawnRate) {
      this.spawnEnemy()
      this.enemyTimer = 0
    }

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
    let starsImage = '/assets/icons/0stars.png'
    const stars = this.getStars()
    // Play appropriate sound before showing popup
    if (stars > 0) {
      SoundManager.play('game_win')
    } else {
      SoundManager.play('game_lose')
    }
    if (stars === 1) starsImage = '/assets/icons/1stars.png'
    else if (stars === 2) starsImage = '/assets/icons/2stars.png'
    else if (stars === 3) starsImage = '/assets/icons/3stars.png'
    this.addChild(
      new LevelEndPopup(
        this.killCount,
        starsImage,
        this.currentLevelIndex === levelConfig.levels.length - 1,
        () =>
          SceneManager.changeScene(new GameScene(this.currentLevelIndex + 1)),
        () => SceneManager.changeScene(new GameScene(this.currentLevelIndex)),
        () => SceneManager.changeScene(new MainMenu()),
        this.currentLevel.id
      )
    )
  }

  private getStars(): number {
    const stars = this.currentLevel.stars
    const timeElapsed = this.currentLevel.duration - this.timeLeft
    if (timeElapsed <= 20 && this.killCount >= stars['20']) return 3
    if (timeElapsed <= 40 && this.killCount >= stars['40']) return 2
    return this.killCount >= 10 ? 1 : 0
  }

  private showFloatingText(text: string, x: number, y: number) {
    const scoreText = new Text(text, {
      fontFamily: 'Arial',
      fontSize: 32,
      fill: '#ffff00',
      fontWeight: 'bold',
      stroke: { color: '#000000', width: 3 }
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
