// src/ui/LevelEndPopup.ts
import { Container, Graphics, Sprite, Text, Assets } from 'pixi.js'

export class LevelEndPopup extends Container {
  constructor(
    score: number,
    starsImagePath: string,
    isLastLevel: boolean,
    onNextLevel: () => void,
    onRestart: () => void,
    onMenu: () => void,
    levelId: number
  ) {
    super()
    this.init(
      score,
      starsImagePath,
      isLastLevel,
      onNextLevel,
      onRestart,
      onMenu,
      levelId
    )
  }

  private async init(
    score: number,
    starsImagePath: string,
    isLastLevel: boolean,
    onNextLevel: () => void,
    onRestart: () => void,
    onMenu: () => void,
    levelId: number
  ) {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    const overlay = new Graphics()
    overlay.beginFill(0x000000, 0.8)
    overlay.drawRect(0, 0, screenWidth, screenHeight)
    overlay.endFill()
    this.addChild(overlay)

    const popup = new Graphics()
    const popupWidth = screenWidth * 0.8
    const popupHeight = screenHeight * 0.8
    popup.beginFill(0x7ba722)
    popup.drawRoundedRect(0, 0, popupWidth, popupHeight, 20)
    popup.endFill()
    popup.x = screenWidth / 2 - popupWidth / 2
    popup.y = screenHeight / 2 - popupHeight / 2
    this.addChild(popup)

    const levelText = new Text({
      text: `Level ${levelId} Complete!`,
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
    levelText.anchor.set(0.5)
    levelText.x = screenWidth / 2
    levelText.y = popup.y + 60
    this.addChild(levelText)

    const resultText = new Text({
      text: `Score: ${score}`,
      style: {
        fontFamily: 'Arial',
        fontSize: 48,
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
    resultText.anchor.set(0.5)
    resultText.x = screenWidth / 2
    resultText.y = popup.y + 120
    this.addChild(resultText)

    const starSprite = new Sprite(await Assets.load(starsImagePath))
    starSprite.anchor.set(0.5)
    starSprite.scale.set(0.8)
    starSprite.x = screenWidth / 2
    starSprite.y = popup.y + popupHeight / 2
    this.addChild(starSprite)

    const restartTexture = await Assets.load('/assets/buttons/restart-btn.png')
    const retryBtn = new Sprite(restartTexture)
    retryBtn.anchor.set(0.5)
    retryBtn.x = screenWidth / 2 - 170
    retryBtn.y = popup.y + popupHeight - 100
    retryBtn.eventMode = 'static'
    retryBtn.cursor = 'pointer'
    retryBtn.on('pointerdown', onRestart)
    this.addChild(retryBtn)

    if (!isLastLevel) {
      const nextTexture = await Assets.load('/assets/buttons/next-btn.png')
      const nextBtn = new Sprite(nextTexture)
      nextBtn.anchor.set(0.5)
      nextBtn.x = screenWidth / 2 + 170
      nextBtn.y = popup.y + popupHeight - 100
      nextBtn.eventMode = 'static'
      nextBtn.cursor = 'pointer'
      nextBtn.on('pointerdown', onNextLevel)
      this.addChild(nextBtn)
    }

    const menuTexture = await Assets.load('/assets/buttons/menu-btn.png')
    const menuBtn = new Sprite(menuTexture)
    menuBtn.anchor.set(0.5)
    menuBtn.x = screenWidth / 2
    menuBtn.y = popup.y + popupHeight - 100
    menuBtn.eventMode = 'static'
    menuBtn.cursor = 'pointer'
    menuBtn.on('pointerdown', onMenu)
    this.addChild(menuBtn)
  }
}
