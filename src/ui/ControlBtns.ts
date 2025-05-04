import { Assets, Sprite, Text } from 'pixi.js'
import { GameScene } from '../scenes/GameScene'
import { SoundManager } from '../core/SoundManager'

export class ControlBtns {
  constructor(public scene: GameScene) {}

  async init() {
    const pauseTexture = await Assets.load('./assets/buttons/pause-btn.png')
    this.scene.pauseButton = new Sprite(pauseTexture)
    this.scene.pauseButton.anchor.set(0.5)
    this.scene.pauseButton.scale.set(0.5)
    this.scene.pauseButton.x = 50
    this.scene.pauseButton.y = window.innerHeight - 50
    this.scene.pauseButton.eventMode = 'static'
    this.scene.pauseButton.cursor = 'pointer'
    this.scene.pauseButton.on('pointerdown', () => {
      SoundManager.play('button')
      this.scene.setPaused(true)
    })
    this.scene.pauseButton.on('pointerover', () => {
      this.scene.pauseButton.scale.set(0.55)
    })
    this.scene.pauseButton.on('pointerout', () => {
      this.scene.pauseButton.scale.set(0.5)
    })
    this.scene.addChild(this.scene.pauseButton)

    const playTexture = await Assets.load('./assets/buttons/play-btn.png')
    this.scene.playButton = new Sprite(playTexture)
    this.scene.playButton.anchor.set(0.5)
    this.scene.playButton.scale.set(0.5)
    this.scene.playButton.x = 50
    this.scene.playButton.y = window.innerHeight - 50
    this.scene.playButton.eventMode = 'static'
    this.scene.playButton.cursor = 'pointer'
    this.scene.playButton.visible = false
    this.scene.playButton.on('pointerdown', () => {
      SoundManager.play('button')
      this.scene.setPaused(false)
    })
    this.scene.addChild(this.scene.playButton)

    const soundOnTexture = await Assets.load('./assets/buttons/sound-on.png')
    const soundOffTexture = await Assets.load('./assets/buttons/sound-off.png')

    this.scene.soundButton = new Sprite(soundOnTexture)
    this.scene.soundButton.anchor.set(0.5)
    this.scene.soundButton.scale.set(0.5)
    this.scene.soundButton.x =
      this.scene.pauseButton.x +
      this.scene.pauseButton.width * this.scene.pauseButton.scale.x +
      45
    this.scene.soundButton.y = this.scene.pauseButton.y
    this.scene.soundButton.eventMode = 'static'
    this.scene.soundButton.cursor = 'pointer'
    this.scene.soundButton.on('pointerdown', () => {
      this.scene.isSoundOn = !this.scene.isSoundOn
      SoundManager.setMute(!this.scene.isSoundOn)
      this.scene.soundButton.texture = this.scene.isSoundOn
        ? soundOnTexture
        : soundOffTexture
    })
    this.scene.soundButton.on('pointerover', () => {
      this.scene.soundButton.scale.set(0.55)
    })
    this.scene.soundButton.on('pointerout', () => {
      this.scene.soundButton.scale.set(0.5)
    })
    this.scene.addChild(this.scene.soundButton)

    this.scene.pauseText = this.scene.createText(
      'PAUSE',
      window.innerWidth / 2,
      window.innerHeight / 2
    )
    this.scene.pauseText.anchor.set(0.5)
    this.scene.pauseText.visible = false
    this.scene.addChild(this.scene.pauseText)

    const boosterOnTexture = await Assets.load(
      './assets/buttons/booster-on.png'
    )
    const boosterOffTexture = await Assets.load(
      './assets/buttons/booster-off.png'
    )

    this.scene.boosterButton = new Sprite(boosterOnTexture)
    this.scene.boosterButton.anchor.set(0.5)
    this.scene.boosterButton.scale.set(0.5)
    this.scene.boosterButton.x =
      this.scene.soundButton.x +
      this.scene.soundButton.width * this.scene.soundButton.scale.x +
      45
    this.scene.boosterButton.y = this.scene.pauseButton.y
    this.scene.boosterButton.eventMode = 'static'
    this.scene.boosterButton.cursor = 'pointer'
    this.scene.boosterButton.on('pointerdown', () => {
      if (!this.scene.boosterUsed) {
        this.scene.timeLeft += 20
        this.scene.boosterUsed = true
        this.scene.boosterButton.texture = boosterOffTexture
        SoundManager.play('boost_time')
      }
    })
    this.scene.boosterButton.on('pointerover', () => {
      if (!this.scene.boosterUsed) this.scene.boosterButton.scale.set(0.55)
    })
    this.scene.boosterButton.on('pointerout', () => {
      this.scene.boosterButton.scale.set(0.5)
    })
    this.scene.addChild(this.scene.boosterButton)
  }
}
