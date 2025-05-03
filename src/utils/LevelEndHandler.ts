// src/utils/LevelEndHandler.ts

import { LevelEndPopup } from '../ui/LevelEndPopup'
import { SceneManager } from '../core/SceneManager'
import { GameScene } from '../scenes/GameScene'
import { MainMenu } from '../scenes/MainMenu'
import { SoundManager } from '../core/SoundManager'
import levelConfig from '../config/levels.json'

export class LevelEndHandler {
  static handle({
    scene,
    killCount,
    currentLevelIndex,
    stars,
    currentLevelId
  }: {
    scene: GameScene
    killCount: number
    currentLevelIndex: number
    stars: number
    currentLevelId: number
  }) {
    let starsImage = './assets/icons/0stars.png'
    if (stars > 0) {
      SoundManager.play('game_win')
    } else {
      SoundManager.play('game_lose')
    }

    if (stars === 1) starsImage = './assets/icons/1stars.png'
    else if (stars === 2) starsImage = './assets/icons/2stars.png'
    else if (stars === 3) starsImage = './assets/icons/3stars.png'

    scene.customCursor.visible = false
    scene.background.cursor = 'auto'
    document.body.style.cursor = 'default'
    scene.isPaused = true

    scene.addChild(
      new LevelEndPopup(
        killCount,
        starsImage,
        currentLevelIndex === levelConfig.levels.length - 1,
        () => SceneManager.changeScene(new GameScene(currentLevelIndex + 1)),
        () => SceneManager.changeScene(new GameScene(currentLevelIndex)),
        () => SceneManager.changeScene(new MainMenu()),
        currentLevelId
      )
    )
  }
}
