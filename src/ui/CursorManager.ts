import { Assets, Sprite } from 'pixi.js'
import { GameScene } from '../scenes/GameScene'

export class CursorManager {
  constructor(private scene: GameScene) {}

  async init() {
    const cursorTexture = await Assets.load('./assets/icons/cursor.png')
    this.scene.customCursor = new Sprite(cursorTexture)
    this.scene.customCursor.anchor.set(0.5)
    this.scene.customCursor.scale.set(0.5)
    this.scene.customCursor.zIndex = 1000
    this.scene.addChild(this.scene.customCursor)

    document.body.style.cursor = 'none'
    window.addEventListener('mousemove', (e) =>
      this.scene.customCursor.position.set(e.clientX, e.clientY)
    )
  }
}
